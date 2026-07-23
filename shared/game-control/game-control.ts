import { RandomAPI } from '../utils/random-api.js';
import { MoveFn, OutOfSequenceMove } from './move-fn.js';
import { Ctx } from './ctx.js';
import { PlayerID } from './playerid.js';

export interface SetupArg0 {
  ctx: Ctx;
  random: RandomAPI;
}

export interface SetupResult {
  state: unknown;
  // Per-player data keyed by player ID. If present, move functions may use
  // getPlayerData and setPlayerData. If absent, those functions throw.
  playerData?: Record<PlayerID, unknown>;
}

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl {
  // Space-free name used to identify the game (c.f. displayName in AppGame).
  name: string;

  minPlayers: number;
  maxPlayers: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (arg0: SetupArg0, setupData: any) => SetupResult;

  moves: Record<string, MoveFn | OutOfSequenceMove>;
}
