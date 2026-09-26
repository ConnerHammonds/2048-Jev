import { advanceGame, createInitialState } from '../logic/game';
import type { Direction, Rng, GameState } from '../logic/types';

export type FaceoffState = {
  player: GameState;
  opponent: GameState;
};

export function createFaceoff(rng: Rng): FaceoffState {
  return {
    player: createInitialState(rng),
    opponent: createInitialState(rng),
  };
}

export function movePlayer(
  faceoff: FaceoffState,
  direction: Direction,
  rng: Rng,
): FaceoffState {
  return {
    ...faceoff,
    player: advanceGame(
      faceoff.player,
      { type: 'move', direction },
      rng,
    ),
  };
}

export function moveOpponent(
  faceoff: FaceoffState,
  direction: Direction,
  rng: Rng,
): FaceoffState {
  return {
    ...faceoff,
    opponent: advanceGame(
      faceoff.opponent,
      { type: 'move', direction },
      rng,
    ),
  };
}
