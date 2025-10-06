import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const PORT = 3000;
const io = new Server(server, {
    connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});


io.on('connection', (socket) => {
    console.log('a user is connected');

    socket.on('disconnect', () => {
        console.log('a user is disconnected')
    })


    
    socket.on('chat message', (msg) => {
        console.log('message : '+ msg)
        io.emit('chat message', msg)
    })
})


server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});