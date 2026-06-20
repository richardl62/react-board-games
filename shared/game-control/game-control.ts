import { RandomAPI } from '../utils/random-api.js';
import { MoveFn } from './move-fn.js';
import { Ctx } from './ctx.js';

export const AllActive = { allActive: true } as const;

export interface SetupArg0 {
  ctx: Ctx;
  random: RandomAPI;
}

// A move that any player may make regardless of whose turn it is.
// The move function may call setPlayerData (see MoveArg0) to update per-player
// game data. If it changes data for players other than the acting player, the
// framework sets changesOtherPlayersData on the server response so the client
// can discard any optimistic chain that depended on stale other-player state.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OutOfSequenceMove<G = any> {
  readonly outOfSequence: true;
  readonly fn: MoveFn<G>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOutOfSequenceMove(move: MoveFn<any> | OutOfSequenceMove): move is OutOfSequenceMove {
  return typeof move === 'object' && move.outOfSequence === true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMoveFunction(move: MoveFn<any> | OutOfSequenceMove): MoveFn<any> {
  return isOutOfSequenceMove(move) ? move.fn : move;
}

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl {
  // Space-free name used to identify the game (c.f. displayName in AppGame).
  name: string;

  minPlayers: number;
  maxPlayers: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (arg0: SetupArg0, setupData: any) => any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moves: Record<string, MoveFn<any> | OutOfSequenceMove>;

  // By default only the current player can make a move. But if turnOrder
  // is set to AllActive, then any player can make a move. (A correctly implemented
  // game should prevent illegal moves, so the check controlled here is really
  // just to catch mistakes.)
  turnOrder?: typeof AllActive;
}
