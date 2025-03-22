


### Story 0: Tech Stack and Repository Setup
**As a developer**, I want to set up the project’s tech stack and repository so the team can begin building the game with a consistent environment.
- **Description**: Initialize a monorepo with frontend (React + PixiJS) and backend (Node.js + Express + Socket.IO) folders, install dependencies, configure build tools, and verify a basic client-server connection. Use TypeScript for type safety and Vite for fast development.
- **Acceptance Criteria**:
  - A Git repository exists with two folders: `frontend` and `backend`.
  - `frontend` folder:
    - Initialized with Vite + React + TypeScript.
    - Dependencies: `react`, `react-dom`, `@pixi/react`, `pixi.js`.
    - Displays "Hello from Frontend" on `localhost:5173` when run.
    - Connects to backend via Socket.IO and logs "Connected to server" in console.
  - `backend` folder:
    - Initialized with Node.js + Express + TypeScript.
    - Dependencies: `express`, `socket.io`, `typescript`.
    - Runs a server on `localhost:3000` that serves a "Hello from Backend" message via HTTP.
    - Accepts Socket.IO connections and emits a "welcome" event with `{ message: "Connected" }`.
  - TypeScript configured with `tsconfig.json` in both folders.
  - ESLint and Prettier configured with basic rules in both folders.
  - A `README.md` in the root explains how to install and run both parts.
  - Running `npm start` in `backend` and `npm run dev` in `frontend` starts the app successfully.
- **Tech Notes**:
  - **Repository**: Use Git (e.g., GitHub). Run `git init` in root, create `frontend` and `backend` subfolders.
  - **Frontend Setup**:
    - Run `npm create vite@latest frontend -- --template react-ts` in root.
    - `cd frontend`, then `npm install @pixi/react pixi.js socket.io-client`.
    - Replace `App.tsx` with:
      ```tsx
      import { useEffect } from 'react';
      import { io } from 'socket.io-client';
      function App() {
        useEffect(() => {
          const socket = io('http://localhost:3000');
          socket.on('welcome', (data) => console.log(data.message));
        }, []);
        return <div>Hello from Frontend</div>;
      }
      export default App;
      ```
    - Configure `vite.config.ts` to use port 5173:
      ```ts
      export default { server: { port: 5173 } };
      ```
  - **Backend Setup**:
    - Run `mkdir backend && cd backend && npm init -y`.
    - `npm install express socket.io typescript @types/node @types/express @types/socket.io --save`.
    - Create `src/index.ts`:
      ```ts
      import express from 'express';
      import { Server } from 'socket.io';
      import http from 'http';
      const app = express();
      const server = http.createServer(app);
      const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });
      app.get('/', (req, res) => res.send('Hello from Backend'));
      io.on('connection', (socket) => {
        socket.emit('welcome', { message: 'Connected' });
      });
      server.listen(3000, () => console.log('Server on 3000'));
      ```
    - Add `tsconfig.json`:
      ```json
      {
        "compilerOptions": {
          "target": "es6",
          "module": "commonjs",
          "strict": true,
          "esModuleInterop": true,
          "outDir": "dist"
        },
        "include": ["src"]
      }
      ```
    - Update `package.json` scripts: `"start": "tsc && node dist/index.js", "dev": "ts-node src/index.ts"`.
    - Install `ts-node` globally: `npm install -g ts-node`.
  - **Code Quality**:
    - In both folders, run `npx eslint --init` (select Airbnb style, TypeScript), then `npm install prettier eslint-config-prettier --save-dev`.
    - Create `.prettierrc`: `{ "semi": true, "singleQuote": true }`.
  - **README.md**:
    ```markdown
    # Evolution .io
    ## Setup
    1. `cd frontend && npm install && npm run dev`
    2. `cd backend && npm install && npm start`
    ## Run
    - Frontend: `localhost:5173`
    - Backend: `localhost:3000`
    ```
  - **Verification**:
    - Start backend (`npm start`), then frontend (`npm run dev`).
    - Open `localhost:5173`, see "Hello from Frontend", check console for "Connected to server".


### Story 1: Creature Spawning and Base Traits
**As a player**, I want my race to spawn with baseline traits so I can start evolving them.
- **Description**: Create a system to spawn creatures for each player at the start of a round with predefined baseline stats. Assume a 2D map of 1000x1000 pixels.
- **Acceptance Criteria**:
  - Each player spawns 5 creatures at random positions within a 200x200 pixel area centered at (500, 500).
  - Baseline stats: 
    - Reproduction Rate: 1 creature every 30 seconds (0.033 spawns/sec).
    - Movement Speed: 50 pixels/sec (moderate).
    - Growth Speed: +10 pixels size every 10 seconds (slow).
    - Nimbleness: 90 degrees/sec turning speed (moderate).
  - Creatures are circles, starting size 20 pixels diameter, colored uniquely per player (e.g., red for Player 1, blue for Player 2).
  - Creatures move randomly in straight lines, turning every 2 seconds.
- **Tech Notes**:
  - **Backend (Node.js)**: Initialize game state with `players` array, each with `{ id, color, creatures: [] }`. Generate 5 creatures per player with base stats in TypeScript type `{ x: number, y: number, size: number, speed: number, nimbleness: number }`. Use `Math.random()` for positions.
  - **Frontend (React + PixiJS)**: Create a `Creature` component using `@pixi/react` to render circles. Sync initial creature data via Socket.IO `on('init')` event from server.
  - **Socket.IO**: Emit `init` event with creature data to all clients on game start.

### Story 2: Experience Gain Over Time
**As a player**, I want to earn experience passively so I can upgrade my race without relying solely on interactions.
- **Description**: Implement a system where each player earns XP at a fixed rate, stored per player and displayed in the UI.
- **Acceptance Criteria**:
  - Players gain 1 XP every second, starting at game time 0.
  - XP is an integer, initialized at 0 for each player.
  - Display XP in a top-left corner UI box (e.g., "XP: 0"), updated every second.
  - If a player has no creatures, XP gain continues (assume they’re still in the game).
- **Tech Notes**:
  - **Backend (Node.js)**: In game loop (10 ticks/sec), increment each player’s XP by 0.1 every 0.1s (sums to 1 XP/sec). Store in `player.xp`. Use `setInterval` for loop.
  - **Frontend (React)**: Create `XPDisplay` component with `useState` for XP. Listen to Socket.IO `xpUpdate` event to set state.
  - **Socket.IO**: Emit `xpUpdate` every second with `{ playerId, xp }` to all clients.

### Story 3: Food Pellet Collection
**As a player**, I want my creatures to collect food pellets for bonus XP so I can evolve faster by exploring the map.
- **Description**: Add food pellets as collectible objects on the map that grant XP when a creature touches them.
- **Acceptance Criteria**:
  - Spawn 100 pellets at random x,y coordinates (0-1000, 0-1000) at game start.
  - Pellets are green circles, 10 pixels diameter.
  - When a creature’s center is within 15 pixels of a pellet’s center, the pellet is collected, granting 5 XP to the creature’s player.
  - Collected pellets disappear; spawn 1 new pellet every 5 seconds at a random position.
  - XP updates immediately in the UI after collection.
- **Tech Notes**:
  - **Backend (Node.js)**: Store pellets in `pellets: [{ id, x, y }]` array. Use game loop to check distance (`Math.sqrt((cx-px)^2 + (cy-py)^2) < 15`) for each creature-pellet pair. On collect, add 5 to `player.xp`, remove pellet, and schedule new spawn with `setTimeout(5000)`.
  - **Frontend (React + PixiJS)**: Render pellets as `Sprite` in PixiJS via `Pellet` component. Update via Socket.IO `pelletUpdate` (add/remove).
  - **Socket.IO**: Emit `pelletUpdate` with `{ id, x, y, action: 'add/remove' }` on spawn/collection.

### Story 4: Trait Upgrade System
**As a player**, I want to spend XP to upgrade my race’s traits so I can customize my strategy.
- **Description**: Build a UI panel and backend logic for players to upgrade traits using XP, applying changes to all their creatures.
- **Acceptance Criteria**:
  - UI: A panel with 5 buttons labeled: "Speed", "Size", "Growth", "Repro", "Nimble".
  - Each trait starts at level 1, max level 5.
  - Costs: Level 2 = 10 XP, Level 3 = 20 XP, Level 4 = 30 XP, Level 5 = 40 XP.
  - On button click, if XP >= cost, deduct XP and increment trait level for the player’s race.
  - Trait effects (per level):
    - Speed: +25 pixels/sec (50, 75, 100, 125, 150).
    - Max Size: +20 pixels (20, 40, 60, 80, 100).
    - Growth: +5 pixels/10s (10, 15, 20, 25, 30).
    - Repro: -5s spawn time (30, 25, 20, 15, 10).
    - Nimble: +45°/s (90, 135, 180, 225, 270).
  - Updates apply instantly to all existing and future creatures.
- **Tech Notes**:
  - **Frontend (React)**: Create `UpgradePanel` component with 5 buttons. Use `useState` for local trait levels/costs, disable buttons if `xp < cost || level >= 5`. On click, emit Socket.IO `upgrade` event with `{ playerId, trait }`.
  - **Backend (Node.js)**: Handle `upgrade` event: check XP, update `player.traits[trait]`, deduct XP, apply new values to `player.creatures`. Emit `traitUpdate` with `{ playerId, trait, level }`.
  - **Socket.IO**: Sync updates to all clients for real-time trait changes.

### Story 5: Eating Mechanic
**As a player**, I want my creatures to eat smaller ones for XP and dominance so I can compete with others.
- **Description**: Code a collision-based eating system where larger creatures consume smaller ones, with a pause penalty.
- **Acceptance Criteria**:
  - If two creatures’ edges overlap (distance between centers < sum of radii), check size.
  - If Creature A’s diameter is >= 1.5x Creature B’s, A eats B.
  - On eating: B is removed, A gains 10 XP for its player, A pauses (speed = 0) for 1 second.
  - After 1s, A resumes normal movement.
  - If sizes are equal or <1.5x, no eating occurs (collision ignored).
  - XP updates in UI immediately.
- **Tech Notes**:
  - **Backend (Node.js)**: In game loop, check collisions (`distance < (r1 + r2)`). If size condition met, remove B, add 10 XP, set `creatureA.paused = true` and `pauseEnd = now + 1s`. Resume speed after 1s via `setTimeout`.
  - **Frontend (PixiJS)**: Update creature positions via Socket.IO `creatureUpdate`. Show pause with opacity change (Feature 10).
  - **Socket.IO**: Emit `creatureUpdate` with `{ id, x, y, size, paused }` and `xpUpdate` on eat.

### Story 6: Nimbleness and Movement Interaction
**As a player**, I want nimbleness to affect turning speed, influenced by movement speed, so my creatures’ agility matches my strategy.
- **Description**: Implement nimbleness as orientation turning speed, reduced by higher movement speed, affecting creature movement.
- **Acceptance Criteria**:
  - Base turning speed = Nimbleness level * 45°/s (90, 135, 180, 225, 270).
  - Penalty: For each Movement Speed level above 1, reduce turning speed by 10% (e.g., Speed L3 = 100 pixels/s, turning speed * 0.8).
  - Creatures update direction every 0.1s, turning toward a random angle (0-360°) at their effective turning speed.
  - If speed = 0 (e.g., during pause), turning stops.
- **Tech Notes**:
  - **Backend (Node.js)**: Calculate `effectiveTurnSpeed = nimbleness * (1 - 0.1 * (speedLevel - 1))`. Update `creature.angle` every 0.1s by `min(effectiveTurnSpeed * 0.1, angleToTarget)`. Use `Math.cos`/`Math.sin` for x,y movement.
  - **Frontend (PixiJS)**: Reflect angle in creature rotation via Socket.IO `creatureUpdate`.
  - **Socket.IO**: Include `angle` in `creatureUpdate` payload.

### Story 7: AI-Controlled Races
**As a player**, I want AI races to compete with me so the game feels dynamic even with few human players.
- **Description**: Add 3 AI races with random traits that follow the same rules as player races.
- **Acceptance Criteria**:
  - At game start, spawn 3 AI races, each with 5 creatures at random map positions (not overlapping players).
  - For each AI race, randomly assign levels 1-5 to all 5 traits (e.g., Speed 2, Size 4, etc.).
  - AI creatures use player mechanics: move randomly, eat, collect pellets, spawn per Repro rate.
  - AI races have unique colors (e.g., purple, yellow, orange).
  - XP earned by AI is tracked but not spent (no upgrades).
- **Tech Notes**:
  - **Backend (Node.js)**: Add AI races to `players` array with `isAI: true`. Use `Math.floor(Math.random() * 5) + 1` for trait levels. Apply same game loop logic as players.
  - **Frontend (PixiJS)**: Render AI creatures with distinct colors via Socket.IO `init` data.
  - **Socket.IO**: Include AI creatures in `init` and `creatureUpdate` events.

### Story 8: Timer and Alpha Win Condition
**As a player**, I want a timer and alpha metric to determine a winner if no one dominates, so rounds have closure.
- **Description**: Add a 15-minute timer and calculate a rolling alpha score based on kills/times eaten.
- **Acceptance Criteria**:
  - Timer starts at 15:00, counts down to 0:00, displayed in UI (top-right).
  - Track kills (eats) and times eaten per race in a 60s rolling window (e.g., store events with timestamps).
  - Alpha score = kills / (times eaten + 1), updated every second.
  - At 0:00, race with highest alpha score wins; display “Winner: [color]” in center screen.
  - If no kills or eats in 60s, score = 0.
- **Tech Notes**:
  - **Backend (Node.js)**: Use `setInterval(1000)` for timer. Store events in `events: [{ raceId, type: 'kill'/'eaten', time }]`; filter for `time > now - 60`. Calculate alpha in loop.
  - **Frontend (React)**: Create `Timer` component with `useState`. Show win screen via `WinScreen` component on Socket.IO `gameEnd`.
  - **Socket.IO**: Emit `timerUpdate` every second and `gameEnd` with `{ winner, reason: 'alpha' }` at 0:00.

### Story 9: Population Dominance Win Condition
**As a player**, I want to win by dominating the population so I have an alternative victory path.
- **Description**: Track total creature population and end the game if any race hits 50%.
- **Acceptance Criteria**:
  - Count all creatures (player + AI) every second, store as TotalPop.
  - For each race, calculate Pop% = (race’s creature count / TotalPop) * 100.
  - If Pop% >= 50 for any race, end game instantly.
  - Display “Winner: [color] - Population Dominance” in center screen.
  - Check occurs after spawning and eating events.
- **Tech Notes**:
  - **Backend (Node.js)**: In game loop, count `creatures.length` per race and total. Check `pop% >= 50` after spawn/eat. Emit `gameEnd` if true.
  - **Frontend (React)**: Reuse `WinScreen` component for pop win via Socket.IO `gameEnd`.
  - **Socket.IO**: Emit `gameEnd` with `{ winner, reason: 'population' }` on dominance.

### Story 10: Visual Feedback for Traits
**As a player**, I want visual cues for my upgrades so I can see my progress.
- **Description**: Add visual effects to reflect trait levels on creatures.
- **Acceptance Criteria**:
  - Max Size: Diameter = 20 + (level-1) * 20 pixels (20, 40, 60, 80, 100).
  - Movement Speed: Add a faint trail (5px long, same color) behind creatures, length * level (5, 10, 15, 20, 25).
  - Growth: Size increases by Growth level * 5 pixels every 10s (10, 15, 20, 25, 30).
  - Repro: Spawn effect (small flash at spawn point) every 30 - (level-1) * 5s.
  - Nimble: Low nimble (L1-2) shows 5px drift on turns; high (L4-5) shows sharp angle change.
- **Tech Notes**:
  - **Frontend (PixiJS)**: Update `Creature` component: set `scale` for size, add `Graphics` trail for speed, animate size on growth tick (Socket.IO `creatureUpdate`), flash sprite on spawn, adjust rotation visuals for nimbleness.
  - **Backend (Node.js)**: Include trait-driven data (size, speed) in `creatureUpdate`.
  - **Socket.IO**: Ensure `creatureUpdate` carries `{ size, speedLevel, nimbleLevel }` for visual sync.
