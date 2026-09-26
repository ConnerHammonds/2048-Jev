import type { GameState, Direction } from '../logic/types';

export interface Agent {
  getMove(state: GameState): Promise<Direction>;
}
