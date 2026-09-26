import type { Agent } from './agent';
import type { Direction, GameState } from '../logic/types';

const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export class RandomAgent implements Agent {
  async getMove(_state: GameState): Promise<Direction> {
    const index = Math.floor(Math.random() * directions.length);
    return directions[index];
  }
}
