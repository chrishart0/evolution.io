import { v4 as uuidv4 } from 'uuid';
import { Creature, Player, GameState } from './types';

const MAP_SIZE = { width: 1000, height: 1000 };
const SPAWN_AREA_SIZE = 200;
const SPAWN_CENTER = { x: 500, y: 500 };

const BASE_STATS = {
  size: 20,
  speed: 50,
  nimbleness: 90,
  reproductionRate: 0.033, // 1 creature every 30 seconds
  growthRate: 10, // +10 pixels every 10 seconds
};

export class GameStateManager {
  private state: GameState;

  constructor() {
    this.state = {
      players: [],
      mapSize: MAP_SIZE,
    };
  }

  private generateRandomPosition(): { x: number; y: number } {
    const halfArea = SPAWN_AREA_SIZE / 2;
    return {
      x: SPAWN_CENTER.x + (Math.random() * SPAWN_AREA_SIZE - halfArea),
      y: SPAWN_CENTER.y + (Math.random() * SPAWN_AREA_SIZE - halfArea),
    };
  }

  private createCreature(): Creature {
    const pos = this.generateRandomPosition();
    return {
      id: uuidv4(),
      x: pos.x,
      y: pos.y,
      size: BASE_STATS.size,
      speed: BASE_STATS.speed,
      nimbleness: BASE_STATS.nimbleness,
      angle: Math.random() * 360,
      lastTurnTime: Date.now(),
    };
  }

  addPlayer(color: string): Player {
    const player: Player = {
      id: uuidv4(),
      color,
      creatures: Array(5).fill(null).map(() => this.createCreature()),
    };
    this.state.players.push(player);
    return player;
  }

  getState(): GameState {
    return this.state;
  }

  updateCreatures() {
    const now = Date.now();
    this.state.players.forEach(player => {
      player.creatures.forEach(creature => {
        // Move creature based on angle and speed
        const radians = (creature.angle * Math.PI) / 180;
        creature.x += Math.cos(radians) * creature.speed * 0.1; // 0.1s update interval
        creature.y += Math.sin(radians) * creature.speed * 0.1;

        // Turn every 2 seconds
        if (now - creature.lastTurnTime >= 2000) {
          creature.angle = Math.random() * 360;
          creature.lastTurnTime = now;
        }

        // Keep creatures within map bounds
        creature.x = Math.max(0, Math.min(MAP_SIZE.width, creature.x));
        creature.y = Math.max(0, Math.min(MAP_SIZE.height, creature.y));
      });
    });
  }
} 