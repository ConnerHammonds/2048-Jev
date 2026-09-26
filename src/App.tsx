import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { Overlay } from './components/Overlay';
import { ScoreBoard } from './components/ScoreBoard';
import { Faceoff } from './components/Faceoff';
import { useElapsedSeconds } from './hooks/useElapsedSeconds';
import { useHighScore } from './hooks/useHighScore';
import { useKeyboardMove } from './hooks/useKeyboardMove';
import { useSwipeInput } from './hooks/useSwipeInput';
import { ANIMATION_MS } from './logic/constants';
import { advanceGame, createInitialState } from './logic/game';
import type { Direction, GameAction, GameState } from './logic/types';

import { JevAgent } from './agents/jevAgent';
import { RandomAgent } from './agents/randomAgent';
import { runSimulation } from './simulation/simulator';

import {
  createFaceoff,
  moveOpponent,
  movePlayer,
} from './faceoff/faceoff';

const defaultRng: () => number = Math.random;
const agent = new JevAgent();
const randomAgent = new RandomAgent();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function init(best: number): GameState {
  return createInitialState(defaultRng, { best });
}

function reducer(state: GameState, action: GameAction): GameState {
  return advanceGame(state, action, defaultRng);
}

export default function App() {
  const { best, recordScore } = useHighScore();
  const [state, dispatch] = useReducer(reducer, best, init);
  const [sessionId, setSessionId] = useState(0);
  const [mode, setMode] = useState<'game' | 'faceoff'>('game');

  const [faceoff, setFaceoff] = useState(() =>
    createFaceoff(Math.random),
  );

  // Keep a ref to the latest Faceoff state so async agent calls
  // don't accidentally use stale React state.
  const faceoffRef = useRef(faceoff);

  useEffect(() => {
    faceoffRef.current = faceoff;
  }, [faceoff]);

  useEffect(() => {
    recordScore(state.score);
  }, [state.score, recordScore]);

  const hasDying = useMemo(
    () =>
      state.tiles.some(
        (t) => t.isDying || t.isNew || t.mergedFrom,
      ),
    [state.tiles],
  );

  useEffect(() => {
    if (!hasDying) return;

    const id = window.setTimeout(() => {
      dispatch({ type: 'commitAnimation' });
    }, ANIMATION_MS + 40);

    return () => window.clearTimeout(id);
  }, [hasDying, state.moveCount]);

  // Only enable the normal game's keyboard controls in Play mode.
  useKeyboardMove(mode === 'game', state.status, dispatch);

  const swipeEnabled =
    mode === 'game' &&
    (state.status === 'idle' || state.status === 'running');

  const boardRef = useSwipeInput(swipeEnabled, dispatch);

  const onRestart = useCallback(() => {
    dispatch({ type: 'restart' });
    setSessionId((s) => s + 1);
  }, []);

  const onContinue = useCallback(
    () => dispatch({ type: 'continueAfterWin' }),
    [],
  );

  const onResume = useCallback(
    () => dispatch({ type: 'resume' }),
    [],
  );

  const onUndo = useCallback(
    () => dispatch({ type: 'undo' }),
    [],
  );

  const onPauseToggle = useCallback(() => {
    dispatch(
      state.status === 'paused'
        ? { type: 'resume' }
        : { type: 'pause' },
    );
  }, [state.status]);

  const onFaceoffPlayerMove = useCallback(
    async (direction: Direction) => {
      const current = faceoffRef.current;

      // Apply the player's move immediately.
      const afterPlayer = movePlayer(
        current,
        direction,
        Math.random,
      );

      faceoffRef.current = afterPlayer;
      setFaceoff(afterPlayer);

      // Wait before letting the opponent respond.
      await delay(500);

      // For now, RandomAgent stands in for Jev.
      const opponentDirection = await randomAgent.getMove(
        afterPlayer.opponent,
      );

      // Apply the opponent's response.
      const afterOpponent = moveOpponent(
        afterPlayer,
        opponentDirection,
        Math.random,
      );

      faceoffRef.current = afterOpponent;
      setFaceoff(afterOpponent);
    },
    [],
  );

  const elapsed = useElapsedSeconds(
    state.status === 'running',
    sessionId,
  );

  const displayedBest = Math.max(best, state.best);

  return (
    <main
      className={
        mode === 'faceoff'
          ? 'app app--faceoff'
          : 'app'
      }
    >
      <header className="app__header">
        <h1 className="app__title">2048</h1>

        <p className="app__subtitle">
          Use arrows or WASD. Space pauses, R restarts, C continues
          after a win.
        </p>

        <div>
          <button onClick={() => setMode('game')}>
            Play
          </button>

          <button onClick={() => setMode('faceoff')}>
            Faceoff
          </button>
        </div>
      </header>

      {mode === 'game' ? (
        <>
          <ScoreBoard
            score={state.score}
            best={displayedBest}
            moves={state.moveCount}
            elapsedSeconds={elapsed}
            status={state.status}
          />

          <div className="app__board-wrap">
            <GameBoard ref={boardRef} tiles={state.tiles} />

            <Overlay
              status={state.status}
              score={state.score}
              onContinue={onContinue}
              onRestart={onRestart}
              onResume={onResume}
            />
          </div>

          <button
            onClick={async () => {
              const direction = await agent.getMove(state);
              dispatch({ type: 'move', direction });
            }}
          >
            Jev Move
          </button>

          <button
            onClick={async () => {
              const agent = new RandomAgent();

              const result = await runSimulation(
                agent,
                100,
                Math.random,
              );

              console.log('Simulation summary:', result);
            }}
          >
            Run 100 Games
          </button>

          <GameControls
            status={state.status}
            canUndo={state.history.length > 0}
            onRestart={onRestart}
            onPauseToggle={onPauseToggle}
            onContinue={onContinue}
            onUndo={onUndo}
          />
        </>
      ) : (
        <Faceoff
          faceoff={faceoff}
          onPlayerMove={onFaceoffPlayerMove}
        />
      )}
    </main>
  );
}
