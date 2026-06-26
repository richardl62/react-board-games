import { AppGame } from '@/app-game-support/app-game';
import { endMatch, endTurn } from '@shared/game-control/ctx';
import { matchMove } from '@shared/game-control/match-action';
import { MatchState } from '@shared/match-state';
import {
  isWsEndMatch,
  isWsEndTurn,
  isWsMove,
  WsRequestedAction,
} from '@shared/ws-requested-action';

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
    if (isWsMove(action)) {
      const { playerData, ...activeState } = matchMove(
        game,
        action.move,
        playerID,
        matchState,
        action.arg,
      );
      return { ...activeState, playerData, errorInLastAction: null };
    }

    let activeState;
    if (isWsEndTurn(action)) {
      const { ctxData, state, prngState } = structuredClone(matchState);
      endTurn(ctxData);
      activeState = { ctxData, state, prngState };
    } else if (isWsEndMatch(action)) {
      const { ctxData, state, prngState } = structuredClone(matchState);
      endMatch(ctxData);
      activeState = { ctxData, state, prngState };
    } else {
      throw new Error('Unrecognised action');
    }

    return { ...activeState, playerData: matchState.playerData, errorInLastAction: null };
  } catch (e) {
    const errorInLastAction = e instanceof Error ? e.message : `Unrecognised error: ${String(e)}`;
    return { ...matchState, errorInLastAction };
  }
}
