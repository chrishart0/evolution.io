- **Frontend**:
  - React (UI components)
  - PixiJS (2D rendering)
  - TypeScript (type safety)
- **Backend**:
  - Node.js (server runtime)
  - Express (HTTP server)
  - Socket.IO (real-time communication)
- **Game Logic**: Custom engine in Node.js
- **Data**: In-memory state
- **Tools**:
  - Vite (build/dev)
  - ESLint + Prettier (code quality)
  - Docker (containerization)
- **Deployment**:
  - Vercel (frontend)
  - DigitalOcean/Heroku (backend)


- Core Systems (1.1-1.3): Node.js + Socket.IO handle game state and XP ticks, broadcast to React clients.
    
- Creatures (2.1-2.5): PixiJS renders creatures; Node.js calculates movement, growth, and spawning.
    
- Traits (3.1-3.3): React UI for upgrades; Node.js applies changes and syncs via Socket.IO.
    
- Eating (4.1-4.3): Node.js detects collisions and pauses; PixiJS shows feedback.
    
- Pellets (5.1-5.2): PixiJS draws pellets; Node.js manages spawning and collection.
    
- AI (6.1-6.2): Node.js generates and runs AI logic.
    
- Win Conditions (7.1-7.2): Node.js computes alpha and population; React displays results.
    
- UI (8.1-8.4): React + PixiJS for all visuals and controls.
    
- Visual Feedback (9.1-9.2): PixiJS handles animations and effects.