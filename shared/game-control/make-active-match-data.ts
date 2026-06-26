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

  if (playerData) {
    // Sanity check - a failure shows an error in the game's implementation.
    for (const playerId of ctxData.playOrder) {
      if (playerData[playerId] === undefined) {
        throw new Error(`Player data missing for player ${playerId}`);
      }
    }
  }

  return { ctxData, state, prngState: random.getState(), playerData };
}
