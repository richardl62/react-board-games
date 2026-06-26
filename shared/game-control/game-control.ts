import { RandomAPI } from '../utils/random-api.js';
import { MoveFn, OutOfSequenceMove } from './move-fn.js';
import { Ctx } from './ctx.js';
import { PlayerID } from './playerid.js';

export const AllActive = { allActive: true } as const;

export interface SetupArg0 {
  ctx: Ctx;
  random: RandomAPI;
}

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl {
  // Space-free name used to identify the game (c.f. displayName in AppGame).
  name: string;

  minPlayers: number;
  maxPlayers: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (arg0: SetupArg0, setupData: any) => unknown;

  // If defined, called once per player at match creation.
  // Required if move functions are to use getPlayerData and setPlayerData.
  setupPlayerData?: (playerId: PlayerID) => unknown;

  moves: Record<string, MoveFn | OutOfSequenceMove>;

  // By default only the current player can make a move. But if turnOrder
  // is set to AllActive, then any player can make a move. (A correctly implemented
  // game should prevent illegal moves, so the check controlled here is really
  // just to catch mistakes.)
  // To do: Remove and use out-of-sequence moves instead.
  turnOrder?: typeof AllActive;
}
