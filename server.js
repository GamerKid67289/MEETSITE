const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const connectedUsers = {};

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('disconnect', () => {
        const username = connectedUsers[socket.id];
        if (username) {
            delete connectedUsers[socket.id];
            io.emit('user-disconnected', username);
        }
    });

    socket.on('sign-in', (username) => {
        if (username && !connectedUsers[socket.id]) {
            connectedUsers[socket.id] = username;
            socket.emit('sign-in-success', username);
            io.emit('user-connected', username);
        } else {
            socket.emit('sign-in-failed', 'Username already taken or invalid.');
        }
    });

    socket.on('send-message', (message) => {
        const username = connectedUsers[socket.id];
        if (username && message) {
            io.emit('message', { username, message });
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
