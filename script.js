document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = (event) => {
        console.log('WebSocket connection established:', event);
    };

    socket.onmessage = (event) => {
        const messages = JSON.parse(event.data);
        messagesContainer.innerHTML = ''; 
        messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.textContent = message.content;
            messagesContainer.appendChild(messageElement);
        });
    };

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.send(message);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message !== '') {
                socket.send(message);
                messageInput.value = '';
            }
        }
    });
});