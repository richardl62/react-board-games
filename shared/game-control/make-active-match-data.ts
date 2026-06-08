import { Ctx, makeCtxData } from './ctx.js';
import { GameControl } from './game-control.js';
import { ActiveMatchData } from '../match-data.js';
import { RandomAPI } from '../utils/random-api.js';

export function makeActiveMatchData(
  gameControl: GameControl,
  numPlayers: number,
  setupData: unknown,
  random: RandomAPI,
): ActiveMatchData {
  const ctxData = makeCtxData(numPlayers);
  const ctx = new Ctx(ctxData);
  const state: unknown = gameControl.setup({ ctx, random }, setupData);
  return { ctxData, state, prngState: random.getState() };
}
