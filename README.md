# Evolution .io

Welcome to **Evolution .io**, a multiplayer browser game where you evolve a race of creatures to dominate the map! Control your species by upgrading traits like speed, size, and reproduction rate, and compete against other players and AI races in fast-paced 15-minute rounds. Will you become the alpha predator or overwhelm with sheer numbers?

## Overview
- **Genre**: Multiplayer .io-style game
- **Round Length**: 15 minutes
- **Objective**: Be the last race standing or win by achieving dominance (highest alpha score or 50% population).
- **Tech Stack**: React, PixiJS, TypeScript, Node.js, Express, Socket.IO

## Features
- **Real-Time Gameplay**: Creatures move, eat, and evolve in sync across all players via WebSockets.
- **Trait Evolution**: Spend XP to upgrade Movement Speed, Max Size, Growth Rate, Reproduction Rate, and Nimbleness.
- **Dynamic Map**: Collect food pellets and outmaneuver opponents on a 1000x1000 pixel battlefield.
- **AI Opponents**: Face off against 3 AI-controlled races with random traits.
- **Win Conditions**: Survive to the end with the highest alpha score (kills/times eaten) or dominate with 50% of the population.

## Project Structure
evolution-io/
├── frontend/        # React + PixiJS client
│   ├── src/        # Source files (App.tsx, etc.)
│   ├── public/     # Static assets
│   └── package.json
├── backend/        # Node.js + Express + Socket.IO server
│   ├── src/        # Source files (index.ts)
│   └── package.json
├── .gitignore      # Git ignore file
└── README.md       # This file

## Prerequisites
- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **Git**: For cloning and version control

## Setup Instructions

Clone the Repository:
```bash
git clone https://github.com/yourusername/evolution-io.git
cd evolution-io
```

Install Frontend Dependencies:
```bash
cd frontend
npm install
```

Install Backend Dependencies:
```bash
cd ../backend
npm install
```

Run the Backend:
```bash
npm start
Server runs on http://localhost:3000.
```

Run the Frontend:
```bash
cd ../frontend
npm run dev
```

Client runs on http://localhost:5173.

Verify Setup:
* Open http://localhost:5173 in your browser.
* You should see "Hello from Frontend".
* Open the browser console (F12) and check for "Connected to server" message.


## Development
* **Frontend:** Uses Vite for fast builds and hot reloading. Edit frontend/src/App.tsx to start coding the game UI and canvas.

* **Backend:** Uses TypeScript with a custom game loop. Modify backend/src/index.ts to add game logic.

* **Real-Time Sync:** Socket.IO handles communication. Emit events from the backend and listen on the frontend.

* **Code Quality:** ESLint and Prettier are configured. Run npm run lint in either folder to check.



## Tech Stack Details

### Frontend:
* React: UI components
* PixiJS: 2D rendering for game canvas
* TypeScript: Type safety

### Backend:
* Node.js: Server runtime
* Express: HTTP server
* Socket.IO: Real-time communication

### Tools:
* Vite: Build tool
* ESLint + Prettier: Code quality
* Docker: (Optional) Containerization




## Contributing
1. Fork the repo and create a feature branch (git checkout -b feature-name).
2. Commit changes (git commit -m "Add feature X").
3. Push to your branch (git push origin feature-name).
4. Open a pull request.

## Deployment (Future)
Frontend: Vercel
Backend: Supabase

## License
MIT License - feel free to use, modify, and distribute!

## Contact
For questions open an issue on GitHub.
