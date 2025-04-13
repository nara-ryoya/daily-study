const socket = io();

socket.on('chat message', function(msg) {
    const li = document.createElement('li');
    li.textContent = msg;
    document.getElementById('messages').appendChild(li);
});

function sendMessage() {
    const message = document.getElementById('message').value;
    socket.emit('chat message', message);
    document.getElementById('message').value = '';
}