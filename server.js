import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { type } from 'os';
import { text } from 'stream/consumers';

const app = express();
const server = createServer(app);
const PORT = 3000;
const io = new Server(server, {
    connectionStateRecovery: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});


io.on('connection', (socket) => {

    if(socket.recovered) {
        console.log("User reconnected")
        return;
    }

    console.log('a user is connected');

    socket.username="Anonymous";
    
    // when a new user joins
    socket.emit('chat message', { text: "Welcome to the chat!", type: 'system'});

    // notifying others that a user just join the chat!
    socket.broadcast.emit('chat message', { text: "A new user just joined the chat!", type: 'system' });

    socket.on('chat message', (msg) => {
        console.log('message : '+ msg.text)
        io.emit('chat message', {
            username:socket.username,
            text: msg.text, 
            type: 'user' })
    })

    socket.on('disconnect', (reason) =>  {

        if(reason === "io server disconnect" || reason === "ping timeout") {
            console.log("Temporary disconnection, skipping 'user left'");
            return;
        }

        console.log('a user is disconnected')
        io.emit('chat message',{ text: "A user left the chat!", type: 'system'});
    })
    
})

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});