const PORT = process.env.PORT || 8900;

const express = require("express");
const io = require('socket.io');
const cors = require("cors");

const app = express();
const socketServer = io(PORT, {cors: {origin: 'https://hilmiarizal.github.io/SOSMED'}});

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
        socketServer.emit("getUsers", users);
    });

    // SEND MESSAGE AND GET MESSAGE
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUsers(receiverId);
        socketServer.to(user.socketId).emit("getMessage", {
            senderId, text,
        });
    })


    socket.on("disconnect", () => {
        console.log('A User Disconnected!');
        removeUsers(socket.id);
    })
});


app.use(cors());

app.get('/', (req, res) => {
    res.send(`SERVER IS RUNNING IN PORT ${PORT}`);
});