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

  // The version of the game's saved state. It should be increased if a change is
  // made that would make previously saved matches unusable. Saved matches with a
  // different version are not displayed or restored.
  stateVersion: number;

  // If true, each online game (including rematches) is recorded so it can be
  // reviewed from the Past Games page. The state is saved after every successful
  // action, but only the latest is kept, so this is worthwhile only if that state
  // is meaningful on its own (e.g. Scrabble, whose state includes the move history).
  // (This is separate from the private save of live matches, which is done for all
  // games so that matches can be resumed after a server restart.)
  // Note: all archived data is publicly readable from the database.
  archive: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (arg0: SetupArg0, setupData: any) => SetupResult;

  moves: Record<string, MoveFn | OutOfSequenceMove>;
}
