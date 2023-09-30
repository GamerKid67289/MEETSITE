const socket = io();

function signIn() {
    const username = document.getElementById('username').value;
    socket.emit('sign-in', username);
    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
}

function sendMessage() {
    const message = document.getElementById('message').value;
    socket.emit('send-message', message);
    document.getElementById('message').value = '';
}

socket.on('user-connected', (username) => {
    const chatMessages = document.getElementById('chat-window');
    chatMessages.innerHTML += `<p><strong>${username}:</strong> connected.</p>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('user-disconnected', (username) => {
    const chatMessages = document.getElementById('chat-window');
    chatMessages.innerHTML += `<p><strong>${username}:</strong> disconnected.</p>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('message', (data) => {
    const chatMessages = document.getElementById('chat-window');
    chatMessages.innerHTML += `<p><strong>${data.username}:</strong> ${data.message}</p>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
