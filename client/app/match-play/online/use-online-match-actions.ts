import { AppGame } from '@/app-game-support/app-game';
import { Player } from '@/app-game-support/types';
import { EventsAPI } from '@shared/game-control/events';
import { WsRequestId, isWsClientRequest } from '@shared/ws-client-request';
import { WsRequestedAction } from '@shared/ws-requested-action';
import { UntypedMoves } from '@/app-game-support/board-props';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ServerConnection } from './use-server-connection';
import { ActionRequestStatus } from '../game-board-wrapper';
import { MatchState } from '@shared/match-state';
import { applyActionLocally } from '../apply-action-locally';
import { isWsClientConnection } from '@shared/ws-response-trigger';

function sameRequestID(a: WsRequestId, b: WsRequestId) {
  return a.playerId === b.playerId && a.number === b.number;
}

interface PendingAction {
  id: WsRequestId;
  action: WsRequestedAction;

  // Was the request for this action queued while disconnected (and so guaranteed
  // delivery by react-use-websocket on reconnect), or sent live (where the response
  // could be lost if the connection drops before it arrives)?
  queuedWhileDisconnected: boolean;

  // The match state predicted to result from this action, computed when it was
  // dispatched by applying it (via applyActionLocally) to the previous pending
  // action's predictedState (or to the last server-confirmed matchState, for the
  // first pending action).
  predictedState: MatchState;
}

// The fields of a MatchState that a local prediction can be compared against. playerData
// is excluded: applyActionLocally passes it through unchanged, but the server's copy can
// change independently as players connect/disconnect.
function predictableFields(matchState: MatchState) {
  const { ctxData, state, prngState, errorInLastAction } = matchState;
  return { ctxData, state, prngState, errorInLastAction };
}

function predictionMatches(predicted: MatchState, actual: MatchState): boolean {
  return JSON.stringify(predictableFields(predicted)) === JSON.stringify(predictableFields(actual));
}

// Return actions - moves and events - suitable for an online game.
// Also return status information about the action requested, and the optimistic
// (locally-predicted) match state, if any actions are currently in flight.
export function useOnlineMatchActions(
  appGame: AppGame,
  player: Player,
  { serverResponse, sendMatchRequest, connectionStatus }: ServerConnection,
  matchState: MatchState,
): {
  moves: UntypedMoves;
  events: EventsAPI;
  actionRequestStatus: ActionRequestStatus;
  optimisticMatchState: MatchState | null;
} {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [optimisticMatchState, setOptimisticMatchState] = useState<MatchState | null>(null);
  const [lastActionUnconfirmed, setLastActionUnconfirmed] = useState(false);
  const [predictionDiverged, setPredictionDiverged] = useState(false);

  const lastRequestNumber = useRef(0);

  // Check if the server response is due to a client action rather than, say, a connection warning.
  const trigger = serverResponse?.trigger;
  const responseId = isWsClientRequest(trigger) ? trigger.id : null;

  // makeAction and the effects below need synchronous access to the current
  // pendingActions, matchState and connectionStatus, without depending on them
  // directly - they change frequently and would invalidate moves/events on every
  // render, or be stale across rapid clicks within the same render.
  const pendingActionsRef = useRef(pendingActions);
  pendingActionsRef.current = pendingActions;
  const matchStateRef = useRef(matchState);
  matchStateRef.current = matchState;
  const connectionStatusRef = useRef(connectionStatus);
  connectionStatusRef.current = connectionStatus;

  // A response has arrived for the oldest pending action. If it matches what we
  // predicted, drop it from the queue - the rest of the queue's predictions remain
  // valid, since each was built on top of this one's predictedState, which has just
  // been confirmed. If it doesn't match, local prediction has diverged from the
  // server (a bug, since applyActionLocally is meant to mirror the server exactly):
  // report it and fall back to the server's state, discarding the rest of the queue.
  useEffect(() => {
    if (!responseId || !serverResponse) {
      return;
    }

    const pending = pendingActionsRef.current;
    if (pending.length === 0) {
      // Response for an action whose entry was already dropped after an earlier
      // divergence - the displayed state already tracks serverResponse.matchState
      // directly.
      return;
    }

    const [prediction, ...rest] = pending;
    const actual = serverResponse.matchState;

    let predictionOK = true;
    if (!sameRequestID(prediction.id, responseId)) {
      console.error('Response received out of order - expected response for a different action', {
        expectedId: prediction.id,
        responseId,
      });
      predictionOK = false;
    } else if (!predictionMatches(prediction.predictedState, actual)) {
      console.error('Optimistic prediction diverged from server response', {
        predicted: prediction.predictedState,
        actual,
      });
      predictionOK = false;
    }

    if (predictionOK) {
      pendingActionsRef.current = rest;
      setPendingActions(rest);
      if (rest.length === 0) {
        setOptimisticMatchState(null);
      }
    } else {
      pendingActionsRef.current = [];
      setPendingActions([]);
      setOptimisticMatchState(null);
      setPredictionDiverged(true);
    }

    setLastActionUnconfirmed(false);
  }, [responseId, serverResponse]);

  // The server's wsClientConnection broadcast (sent on every connect/disconnect) carries
  // authoritative state but isn't tied to any particular request. The right response
  // depends on how the oldest pending action (if any) was sent:
  //
  // Scenario A (queuedWhileDisconnected = false): sent live before the connection
  // dropped. The response may never arrive, and everything chained on top of it is
  // unverifiable. Drop the whole queue and fall back to the server's state.
  //
  // Scenario B (queuedWhileDisconnected = true): queued while offline and just flushed
  // by react-use-websocket. The server sends wsClientConnection before processing the
  // freshly-arrived request, so the response is still coming. Leave the queue intact;
  // the responseId effect will handle it as responses arrive.
  useEffect(() => {
    if (trigger && isWsClientConnection(trigger)) {
      const pending = pendingActionsRef.current;
      if (pending.length > 0 && !pending[0].queuedWhileDisconnected) {
        pendingActionsRef.current = [];
        setPendingActions([]);
        setOptimisticMatchState(null);
        setLastActionUnconfirmed(true);
      }
    }
  }, [trigger]);

  const makeAction = useCallback(
    (action: WsRequestedAction) => {
      // The player is proceeding past any earlier issue - they've seen wherever the
      // board ended up and are acting on it.
      setLastActionUnconfirmed(false);
      setPredictionDiverged(false);

      // Apply the action locally on top of the current chain tip (the last pending
      // action's predicted state, or the last server-confirmed state if none is
      // pending), so it's reflected on the board immediately, exactly as the offline
      // game does. If local validation rejects it, show the resulting error (just
      // like offline) and don't bother sending it - the server would only reject it
      // identically, and the UI shouldn't be offering invalid actions in the first
      // place.
      const pending = pendingActionsRef.current;
      const base =
        pending.length > 0 ? pending[pending.length - 1].predictedState : matchStateRef.current;
      const predictedState = applyActionLocally(appGame, action, player.id, base);
      setOptimisticMatchState(predictedState);

      if (predictedState.errorInLastAction !== null) {
        return;
      }

      lastRequestNumber.current += 1;
      const id: WsRequestId = { playerId: player.id, number: lastRequestNumber.current };
      const next = [
        ...pending,
        {
          id,
          action,
          queuedWhileDisconnected: connectionStatusRef.current !== 'connected',
          predictedState,
        },
      ];
      pendingActionsRef.current = next;
      setPendingActions(next);

      sendMatchRequest({ id, action });
    },
    [appGame, player.id, sendMatchRequest],
  );

  const { moves, events } = useMemo(() => {
    const moves: UntypedMoves = {};
    for (const moveName of Object.keys(appGame.moves)) {
      moves[moveName] = (arg) => makeAction({ move: moveName, arg });
    }

    const events: EventsAPI = {
      endTurn: () => makeAction({ endTurn: true }),
      endMatch: () => makeAction({ endMatch: true }),
    };

    return { moves, events };
  }, [appGame.moves, makeAction]);

  const waitingForServer = pendingActions.length > 0;

  return useMemo(
    () => ({
      moves,
      events,
      actionRequestStatus: { waitingForServer, lastActionUnconfirmed, predictionDiverged },
      optimisticMatchState,
    }),
    [
      moves,
      events,
      waitingForServer,
      lastActionUnconfirmed,
      predictionDiverged,
      optimisticMatchState,
    ],
  );
}
