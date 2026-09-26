import { RandomAgent } from '../agents/randomAgent';
import { simulateGame } from './simulator';

const agent = new RandomAgent();

const result = await simulateGame(agent, Math.random);

console.log(result);
