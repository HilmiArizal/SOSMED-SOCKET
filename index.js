const PORT = process.env.PORT || 8900;

const express = require("express");
const io = require('socket.io');
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
// const socketServer = io(server, {cors: {origin: 'https://hilmiarizal.github.io/SOSMED'}});
const socketServer = io(server, {cors: {origin: 'http://192.168.1.5:3000'}});

let users = [];

const addUsers = (userId, socketId) => {
    !users.some(item => item.userId === userId) && users.push({ userId, socketId });
}

const removeUsers = (socketId) => {
    users = users.filter(item => item.socketId !== socketId);
}

const getUsers = (userId) => {
    return users.find((item) => item.userId === userId);
}

socketServer.on("connection", (socket) => {
    console.log('A User Connected');
    
    socket.on("addUser", (userId) => {
        addUsers(userId, socket.id);
        socketServer.emit("getUser", users);
    });
    
    // SEND MESSAGE AND GET MESSAGE
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUsers(receiverId);
        socketServer.to(user?.socketId).emit("getMessage", {
            senderId, text,
        });
    })


    socket.on("disconnect", () => {
        console.log('A User Disconnected!');
        removeUsers(socket.id);
    })
});


// app.use(cors());

app.get('/', (req, res) => {
    res.send(`SERVER IS RUNNING IN PORT ${PORT}`);
});

server.listen(PORT, '0.0.0.0', () => console.log(`SERVER SOCKET RUNNING IN PORT ${PORT}`));