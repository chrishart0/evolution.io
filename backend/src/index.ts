import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { GameStateManager } from './gameState';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });

const gameState = new GameStateManager();

// Game loop
setInterval(() => {
  gameState.updateCreatures();
  const state = gameState.getState();
  console.log('Broadcasting game state:', {
    players: state.players.length,
    totalCreatures: state.players.reduce((sum, p) => sum + p.creatures.length, 0)
  });
  io.emit('gameState', state);
}, 100);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Add a new player with a random color
  const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
  const player = gameState.addPlayer(colors[Math.floor(Math.random() * colors.length)]);
  console.log('Added new player:', { id: player.id, color: player.color });
  
  // Send initial game state to the new player
  socket.emit('init', { playerId: player.id, gameState: gameState.getState() });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});