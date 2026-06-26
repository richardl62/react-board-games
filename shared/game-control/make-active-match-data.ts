import { Ctx, makeCtxData } from './ctx.js';
import { GameControl } from './game-control.js';
import { ActiveMatchState } from '../match-state.js';
import { RandomAPI } from '../utils/random-api.js';
import { PlayerID } from './playerid.js';

export interface ActiveMatchStateWithPlayerData extends ActiveMatchState {
  playerData?: Record<PlayerID, unknown>;
}

export function makeActiveMatchState(
  gameControl: GameControl,
  numPlayers: number,
  setupData: unknown,
  random: RandomAPI,
): ActiveMatchStateWithPlayerData {
  const ctxData = makeCtxData(numPlayers);
  const ctx = new Ctx(ctxData);
  const { state, playerData } = gameControl.setup({ ctx, random }, setupData);
  return { ctxData, state, prngState: random.getState(), playerData };
}
