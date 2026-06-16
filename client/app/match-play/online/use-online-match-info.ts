// Online match play with optimistic updates.
//
// This hook sits between the player's actions (moves/end-turn/end-match) and the
// server connection. Its job is to make online play feel as immediate as offline
// play, and to behave sensibly when the network is unreliable.
//
// It is the game-specific layer: it predicts an action's result (applyActionLocally,
// which mirrors the server's validation), decides from the prediction whether the
// action is valid, maps the game's moves/events onto request submissions, and reports
// a locally-rejected action's error (without sending anything). All of the
// game-agnostic reliability machinery - the queue of requests awaiting confirmation,
// the optimistic state shown on the board, the "send only over a confirmed connection"
// policy, reconnection handling, and server reconciliation - lives in
// usePendingRequests (see use-pending-requests.ts).
import { AppGame } from '@/app-game-support/app-game';
import { Player } from '@/app-game-support/types';
import { EventsAPI } from '@shared/game-control/events';
import { WsRequestedAction } from '@shared/ws-requested-action';
import { UntypedMoves } from '@/app-game-support/board-props';
import { useMemo, useState } from 'react';
import { ServerConnection } from './use-server-connection';
import { ActionRequestStatus } from '../game-board-wrapper';
import { MatchState } from '@shared/match-state';
import { applyActionLocally } from '../apply-action-locally';
import { usePendingRequests } from './use-pending-requests';

// Return information suitable for an online game.  This is
// - match state (which may be an optimistic prediction)
// - actions (moves and events)
// - the status of action requests (e.g. whether we are waiting for the server)
export function useOnlineMatchInfo(
  appGame: AppGame,
  player: Player,
  { sendMatchRequest, connectionStatus, responseHandlerRef }: ServerConnection,
  matchState: MatchState,
): {
  moves: UntypedMoves;
  events: EventsAPI;
  actionRequestStatus: ActionRequestStatus;
  matchState: MatchState;
} {
  const pending = usePendingRequests(player.id, connectionStatus, sendMatchRequest, matchState);

  responseHandlerRef.current = pending.handleServerResponse;

  // The error, if any, from the last action attempted here (i.e. from the last call to
  // applyActionLocally). Such actions don't change the displayed match state other than
  // the error flag, and are not sent to the server.
  const [localError, setLocalError] = useState<string | null>(null);

  const { submit, predictionBase } = pending;
  const { moves, events } = useMemo(() => {
    // Predict the action's result on top of the current chain tip. If the prediction
    // carries an error (e.g. the action is locally invalid) just report it - the server
    // would only reject it identically. Otherwise clear any earlier error and submit.
    //
    // The base is predictionBase() (the live chain tip), not the displayed matchState.
    // The two are identical at the start of a handler, but a single user action can be
    // implemented by two or more move/event calls in one synchronous handler or effect
    // (e.g. crosstiles' make-grid calls recordGrid then doneRecordingGrid) - there is no
    // re-render between them, so the displayed matchState would still be the pre-first-
    // call value, whereas predictionBase() reflects the first submission so the second
    // chains on it correctly.
    const submitAction = (action: WsRequestedAction) => {
      const expected = applyActionLocally(appGame, action, player.id, predictionBase());
      if (expected.errorInLastAction !== null) {
        setLocalError(expected.errorInLastAction);
      } else {
        setLocalError(null);
        submit(action, expected);
      }
    };

    const moves: UntypedMoves = {};
    for (const moveName of Object.keys(appGame.moves)) {
      moves[moveName] = (arg) => submitAction({ move: moveName, arg });
    }

    const events: EventsAPI = {
      endTurn: () => submitAction({ endTurn: true }),
      endMatch: () => submitAction({ endMatch: true }),
    };

    return { moves, events };
  }, [appGame, player.id, submit, predictionBase]);

  const { waitingForServer, lastActionUnconfirmed, predictionDiverged } = pending;

  return useMemo(
    () => ({
      moves,
      events,
      actionRequestStatus: { waitingForServer, lastActionUnconfirmed, predictionDiverged },
      // Overlay a locally-rejected action's error onto the displayed state without
      // otherwise changing it.
      matchState: { ...pending.matchState, errorInLastAction: localError },
    }),
    [
      moves,
      events,
      waitingForServer,
      lastActionUnconfirmed,
      predictionDiverged,
      pending.matchState,
      localError,
    ],
  );
}
