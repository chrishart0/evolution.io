export interface Creature {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  nimbleness: number;
  angle: number;
  lastTurnTime: number;
}

export interface Player {
  id: string;
  color: string;
  creatures: Creature[];
}

export interface GameState {
  players: Player[];
  mapSize: {
    width: number;
    height: number;
  };
} 