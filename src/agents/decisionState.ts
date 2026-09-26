import type { GameState } from '../logic/types';

export type DecisionState = {
  board: number[][];
  score: number;
};

export function toDecisionState(state: GameState): DecisionState {
  const board = Array.from({ length: state.size }, () =>
    Array<number>(state.size).fill(0)
  );

  for (const tile of state.tiles) {
    board[tile.row][tile.col] = tile.value;
  }

  return {
    board,
    score: state.score,
  };
}
