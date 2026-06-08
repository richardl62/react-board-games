import { CtxData, isCtxData } from './game-control/ctx.js';
import { PublicPlayerMetadata } from './lobby/types.js';

/** The infomation about a match that can be changed by a move or event. */
export interface ActiveMatchState {
  /** The context data (player order, etc.) for the match, changed by events
   * also by moves that trigger events.
   */
  ctxData: CtxData;

  /** The current state of the game, changed by moves.*/
  state: unknown;

  /** PRNG state after the last move. Allows the client to reconstruct the
   * same random sequence for optimistic updates. (PRNG -> Psuedo Random Number Generated)
   **/
  prngState: number;
}

/** The configurable/changable data for a match */
export interface MatchState extends ActiveMatchState {
  /** The players who have joined the game */
  playerData: PublicPlayerMetadata[];
}

export function isMatchState(obj: unknown): obj is MatchState {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as MatchState;

  return Array.isArray(candidate.playerData) && isCtxData(candidate.ctxData);
}
