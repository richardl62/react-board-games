import { Ctx } from './ctx.js';
import { EventsAPI } from './events.js';
import { PlayerID } from './playerid.js';
import { RandomAPI } from '../utils/random-api.js';

export interface MoveArg0<G> {
  G: G;
  ctx: Ctx;
  viewingPlayer: PlayerID;
  random: RandomAPI;
  events: EventsAPI;
  // Update the game-defined per-player data for the given player. The value is
  // stored in PublicPlayerMetadata.gameData and broadcast to all clients.
  // Calling this for a player other than viewingPlayer sets changesOtherPlayersData
  // on the server response, causing clients to discard their optimistic chain.
  setPlayerData: (playerId: PlayerID, data: unknown) => void;
  // Read the current game data for a player. Returns the value set by setPlayerData
  // within this move (if called for that player), otherwise the server-authoritative
  // value from PublicPlayerMetadata.gameData.
  getPlayerData: (playerId: PlayerID) => unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MoveFn<G = any, Arg = any> = (
  context: MoveArg0<G>,
  arg: Arg,
) => void;

// A move that any player may make regardless of whose turn it is.
// The move function may call setPlayerData (see MoveArg0) to update per-player
// game data. If it changes data for players other than the acting player, the
// framework sets changesOtherPlayersData on the server response so the client
// can discard any optimistic chain that depended on stale other-player state.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OutOfSequenceMove<G = any, Arg = any> {
  readonly outOfSequence: true;
  readonly fn: MoveFn<G, Arg>;
}

export function isOutOfSequenceMove(move: MoveFn | OutOfSequenceMove): move is OutOfSequenceMove {
  return typeof move === 'object' && move.outOfSequence === true;
}

export function getMoveFunction(move: MoveFn | OutOfSequenceMove): MoveFn {
  return isOutOfSequenceMove(move) ? move.fn : move;
}

export function outOfSequenceMove<G, Arg>(fn: MoveFn<G, Arg>): OutOfSequenceMove<G, Arg> {
  return { outOfSequence: true, fn };
}

type UnwrapMoveFn<T> = T extends { fn: infer F extends MoveFn } ? F : T extends MoveFn ? T : never;

export type ClientMoveFunctions<
  functions extends Record<string, MoveFn | { readonly fn: MoveFn }>,
> = {
  [Name in keyof functions]: (arg: Parameters<UnwrapMoveFn<functions[Name]>>[1]) => void;
};
