import { advanceGame, createInitialState } from '../logic/game';
import type { Rng, GameState } from '../logic/types';
import type { Agent } from '../agents/agent';

export type SimulationResult = {
  score: number;
  maxTile: number;
  moves: number;
  won: boolean;
};

export type SimulationSummary = {
  games: number;
  averageScore: number;
  medianScore: number;
  averageMaxTile: number;
  averageMoves: number;
  winRate: number;
  highestTile: number;
};

export async function simulateGame(
  agent: Agent,
  rng: Rng,
): Promise<SimulationResult> {
  let state = createInitialState(rng);

  while (state.status !== 'gameOver' && state.status !== 'won') {
    const direction = await agent.getMove(state);

    state = advanceGame(
      state,
      { type: 'move', direction },
      rng,
    );
  }
  

  const maxTile = Math.max(
    ...state.tiles.map((tile) => tile.value),
  );

  return {
    score: state.score,
    maxTile,
    moves: state.moveCount,
    won: state.hasWon,
  };
}

export async function runSimulation(
  agent: Agent,
  games: number,
  rng: Rng,
): Promise<SimulationSummary> {
  const results: SimulationResult[] = [];

  for (let i = 0; i < games; i++) {
    results.push(await simulateGame(agent, rng));
  }

  const scores = results.map((result) => result.score);
  const sortedScores = [...scores].sort((a, b) => a - b);

  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const totalMaxTile = results.reduce(
    (sum, result) => sum + result.maxTile,
    0,
  );
  const totalMoves = results.reduce(
    (sum, result) => sum + result.moves,
    0,
  );

  const wins = results.filter((result) => result.won).length;

  const middle = Math.floor(sortedScores.length / 2);
  const medianScore =
    sortedScores.length % 2 === 0
      ? (sortedScores[middle - 1] + sortedScores[middle]) / 2
      : sortedScores[middle];

  return {
    games,
    averageScore: totalScore / games,
    medianScore,
    averageMaxTile: totalMaxTile / games,
    averageMoves: totalMoves / games,
    winRate: wins / games,
    highestTile: Math.max(...results.map((result) => result.maxTile)),
  };
}

