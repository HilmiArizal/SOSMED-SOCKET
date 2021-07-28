const PORT = process.env.PORT || 8900;

const io = require('socket.io')(PORT, {
    cors: {
        origin: "http://192.168.1.6:50527"
    },
});

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

io.on("connection", (socket) => {
    console.log('A User Connected');

    socket.on("addUser", (userId) => {
        addUsers(userId, socket.id);
        io.emit("getUsers", users);
    });

    // SEND MESSAGE AND GET MESSAGE
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUsers(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId, text,
        });
    })


    socket.on("disconnect", () => {
        console.log('A User Disconnected!');
        removeUsers(socket.id);
    })
});