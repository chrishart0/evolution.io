import { useEffect, useRef, useState } from 'react';
import { Application, Graphics } from 'pixi.js';
import { io } from 'socket.io-client';
import { GameState } from './types';

// Fixed game dimensions
const GAME_SIZE = 1000;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_SPEED = 0.1;

function App() {
  // Refs & State
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const initializingRef = useRef(false);
  const [zoom, setZoom] = useState(1);

  /**
   * IMPORTANT: Canvas Rendering Notes
   * 1. Initialize PixiJS only once using useRef to track initialization
   * 2. Use fixed dimensions (1000x1000) for game area
   * 3. Container handles scrolling if game area is larger than viewport
   * 4. Clean up properly to prevent memory leaks
   * 5. Keep essential logs for debugging canvas issues
   * 6. Handle zoom with mouse wheel and stage scale
   */
  useEffect(() => {
    // Prevent double initialization
    if (!containerRef.current || appRef.current || initializingRef.current) {
      console.log('Skipping PIXI init:', { 
        hasContainer: !!containerRef.current, 
        hasApp: !!appRef.current,
        isInitializing: initializingRef.current 
      });
      return;
    }

    console.log('🎨 Initializing PIXI application');
    initializingRef.current = true;
    const app = new Application();
    
    const initApp = async () => {
      if (!containerRef.current) return;
      
      // Initialize with fixed dimensions
      await app.init({
        backgroundColor: '#1a1a1a',
        width: GAME_SIZE,
        height: GAME_SIZE,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      });

      // Store reference and append canvas
      appRef.current = app;
      containerRef.current.appendChild(app.canvas);
      console.log('✅ Canvas created:', app.canvas.width, 'x', app.canvas.height);

      // Handle zooming
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        // Calculate new zoom level
        const delta = e.deltaY < 0 ? ZOOM_SPEED : -ZOOM_SPEED;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
        
        if (newZoom !== zoom) {
          setZoom(newZoom);
          console.log('🔍 Zoom level:', newZoom);
        }
      };

      containerRef.current.addEventListener('wheel', handleWheel);
      return () => containerRef.current?.removeEventListener('wheel', handleWheel);
    };

    initApp().catch(error => {
      console.error('❌ PIXI initialization failed:', error);
      initializingRef.current = false;
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up PIXI application');
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [zoom]);

  // Socket connection
  useEffect(() => {
    console.log('🔌 Setting up socket connection');
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('🟢 Socket connected');
    });

    socket.on('init', ({ gameState }) => {
      console.log('🎮 Game initialized');
      setGameState(gameState);
    });

    socket.on('gameState', (newGameState) => {
      setGameState(newGameState);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
    });

    return () => {
      console.log('🔌 Disconnecting socket');
      socket.disconnect();
    };
  }, []);

  // Update game objects
  useEffect(() => {
    if (!appRef.current || !gameState) return;

    const app = appRef.current;
    const stage = app.stage;

    // Apply zoom
    stage.scale.set(zoom);

    // Clear previous frame
    stage.removeChildren();
    
    // Draw all creatures
    let creatureCount = 0;
    gameState.players.forEach(player => {
      player.creatures.forEach(creature => {
        const graphics = new Graphics();
        
        graphics
          .circle(0, 0, creature.size / 2)
          .fill({ color: player.color });

        // Use raw coordinates (0-1000 range)
        graphics.x = creature.x;
        graphics.y = creature.y;
        graphics.angle = creature.angle;
        
        stage.addChild(graphics);
        creatureCount++;
      });
    });
    console.log('🎯 Rendered creatures:', creatureCount, 'at zoom:', zoom);
  }, [gameState, zoom]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      overflow: 'auto',
      backgroundColor: '#1a1a1a',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div 
        ref={containerRef}
        style={{
          width: GAME_SIZE,
          height: GAME_SIZE,
          position: 'relative'
        }}
      >
        {!gameState && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '20px'
          }}>
            Loading game...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;