import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello from Backend');
});

io.on('connection', (socket) => {
  socket.emit('welcome', { message: 'Connected' });
  console.log('New connection', socket.id);
});

server.listen(3000, () => console.log('Server on http://localhost:3000'));