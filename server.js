const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const wss = new WebSocket.Server({ server: httpServer });

const db = new sqlite3.Database('messages.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS messages (content TEXT)");
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    db.all('SELECT content FROM messages', [], (err, rows) => {
        if (err) {
            throw err;
        }
        ws.send(JSON.stringify(rows));
    });

    ws.on('message', (message) => {
        db.run('INSERT INTO messages (content) VALUES (?)', [message], (err) => {
            if (err) {
                console.error('Error inserting message:', err.message);
            } else {
                console.log('Message inserted successfully');
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify([{ content: message }]));
                    }
                });
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});