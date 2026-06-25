import { Ctx } from './ctx.js';
import { EventsAPI } from './events.js';
import { PlayerID } from './playerid.js';
import { RandomAPI } from '../utils/random-api.js';

export interface MoveArg0<G, PD = unknown> {
  G: G;
  ctx: Ctx;
  viewingPlayer: PlayerID;
  random: RandomAPI;
  events: EventsAPI;

  // Update the game-defined per-player data for the given player. The value is
  // stored in PublicPlayerMetadata.gameData and broadcast to all clients.
  setPlayerData: (playerId: PlayerID, data: PD) => void;

  // Read the current game data for a player.
  getPlayerData: (playerId: PlayerID) => PD;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MoveFn<G = any, Arg = any, PD = any> = (context: MoveArg0<G, PD>, arg: Arg) => void;

// A move that any player may make regardless of whose turn it is.
// Only these moves may use getPlayerData and setPlayerData (see MoveArg0) to access
// per-player game data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OutOfSequenceMove<G = any, Arg = any, PD = any> {
  readonly outOfSequence: true;
  readonly fn: MoveFn<G, Arg, PD>;
}

export function isOutOfSequenceMove(move: MoveFn | OutOfSequenceMove): move is OutOfSequenceMove {
  return typeof move === 'object' && move.outOfSequence === true;
}

export function getMoveFunction(move: MoveFn | OutOfSequenceMove): MoveFn {
  return isOutOfSequenceMove(move) ? move.fn : move;
}

export function outOfSequenceMove<G, Arg, PD>(
  fn: MoveFn<G, Arg, PD>,
): OutOfSequenceMove<G, Arg, PD> {
  return { outOfSequence: true, fn };
}

type UnwrapMoveFn<T> = T extends { fn: infer F extends MoveFn } ? F : T extends MoveFn ? T : never;

export type ClientMoveFunctions<
  functions extends Record<string, MoveFn | { readonly fn: MoveFn }>,
> = {
  [Name in keyof functions]: (arg: Parameters<UnwrapMoveFn<functions[Name]>>[1]) => void;
};
