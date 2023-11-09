const socket = new WebSocket('ws://localhost:3000');

socket.onopen = (event) => {
    console.log('WebSocket connection established:', event);
};

socket.onmessage = (event) => {
    const messages = JSON.parse(event.data);
   
};

const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.send(message);
        messageInput.value = '';
    }
});