import type { Agent } from './agent';
import type { Direction, GameState } from '../logic/types';
import { toDecisionState } from './decisionState';

const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export class JevAgent implements Agent {
  async getMove(state: GameState): Promise<Direction> {
    const decisionState = toDecisionState(state);

    const response = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TYPESAFE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'jev-latest',
        state: decisionState,
        questions: {
          move: {
            type: 'choice',
            instructions: 'Choose the best move to make in this game of 2048.',
            criteria: {
              UP: 'Move all tiles upward.',
              DOWN: 'Move all tiles downward.',
              LEFT: 'Move all tiles to the left.',
              RIGHT: 'Move all tiles to the right.',
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`TypeSafe API error: ${response.status}`);
    }

    const data = await response.json();

    const move = data.answers.move.choice;

    if (!directions.includes(move)) {
      throw new Error(`Jev returned invalid move: ${move}`);
    }

    return move;
  }
}
