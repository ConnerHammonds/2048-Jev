import { useCallback, useEffect } from 'react';
import type { FaceoffState } from '../faceoff/faceoff';
import {
  moveOpponent,
  movePlayer,
} from '../faceoff/faceoff';
import type { Direction } from '../logic/types';
import { RandomAgent } from '../agents/randomAgent';
import { GameBoard } from './GameBoard';

type FaceoffProps = {
  faceoff: FaceoffState;
  onPlayerMove: (direction: Direction) => void;
  onOpponentMove: (direction: Direction) => void;
};

const randomAgent = new RandomAgent();

export function Faceoff({
  faceoff,
  onPlayerMove,
  onOpponentMove,
}: FaceoffProps) {
  const handlePlayerMove = useCallback(
    async (direction: Direction) => {
      onPlayerMove(direction);

      const opponentDirection =
        await randomAgent.getMove(faceoff.opponent);

      onOpponentMove(opponentDirection);
    },
    [faceoff.opponent, onPlayerMove, onOpponentMove],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      let direction: Direction | null = null;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'UP';
          break;

        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'DOWN';
          break;

        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'LEFT';
          break;

        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'RIGHT';
          break;
      }

      if (direction) {
        event.preventDefault();
        void handlePlayerMove(direction);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlayerMove]);

  return (
    <div className="faceoff">
      <div className="faceoff__side">
        <h2>You</h2>

        <div className="app__board-wrap">
          <GameBoard tiles={faceoff.player.tiles} />
        </div>

        <p>Score: {faceoff.player.score}</p>
      </div>

      <div className="faceoff__side">
        <h2>Jev</h2>

        <div className="app__board-wrap">
          <GameBoard tiles={faceoff.opponent.tiles} />
        </div>

        <p>Score: {faceoff.opponent.score}</p>
      </div>
    </div>
  );
}
