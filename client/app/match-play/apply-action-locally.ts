import { AppGame } from '@/app-game-support/app-game';
import { endMatch, endTurn } from '@shared/game-control/ctx';
import { matchMove } from '@shared/game-control/match-action';
import { MatchState } from '@shared/match-state';
import { isWsEndMatch, isWsEndTurn, isWsMove, WsRequestedAction } from '@shared/ws-requested-action';

/**
 * Apply a requested action (move, end turn or end match) to a match state, returning
 * the resulting state. Mirrors the validation performed by the server
 * (doProcessActionRequest): on success, errorInLastAction is cleared; on failure, the
 * original state is kept and errorInLastAction is set to the error message.
 */
export function applyActionLocally(
  game: AppGame,
  action: WsRequestedAction,
  playerID: string,
  matchState: MatchState,
): MatchState {
  try {
    let mutated;
    if (isWsMove(action)) {
      mutated = matchMove(game, action.move, playerID, matchState, action.arg);
    } else if (isWsEndTurn(action)) {
      const { ctxData, state, prngState } = structuredClone(matchState);
      endTurn(ctxData);
      mutated = { ctxData, state, prngState };
    } else if (isWsEndMatch(action)) {
      const { ctxData, state, prngState } = structuredClone(matchState);
      endMatch(ctxData);
      mutated = { ctxData, state, prngState };
    } else {
      throw new Error('Unrecognised action');
    }

    return { ...mutated, playerData: matchState.playerData, errorInLastAction: null };
  } catch (e) {
    const errorInLastAction = e instanceof Error ? e.message : `Unrecognised error: ${String(e)}`;
    return { ...matchState, errorInLastAction };
  }
}
