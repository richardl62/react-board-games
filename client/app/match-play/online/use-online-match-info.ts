import { AppGame } from '@/app-game-support/app-game';
import { Player } from '@/app-game-support/types';
import { EventsAPI } from '@shared/game-control/events';
import { WsClientRequest, WsRequestId, isWsClientRequest } from '@shared/ws-client-request';
import { WsRequestedAction } from '@shared/ws-requested-action';
import { UntypedMoves } from '@/app-game-support/board-props';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ServerConnection } from './use-server-connection';
import { ActionRequestStatus } from '../game-board-wrapper';
import { MatchState } from '@shared/match-state';
import { applyActionLocally } from '../apply-action-locally';
import { isWsClientConnection } from '@shared/ws-response-trigger';
import { WsServerResponse } from '@shared/ws-server-response';

function sameRequestID(a: WsRequestId, b: WsRequestId) {
  return a.playerId === b.playerId && a.number === b.number;
}

interface PendingAction {
  id: WsRequestId;
  action: WsRequestedAction;

  // True once sendMatchRequest has been called for this action. This will be done
  // only over a connection the server is known to have accepted (see makeAction
  // and the wsClientConnection handling in handleServerResponse). False means the
  // request hasn't been sent yet and must be sent as soon as the connection is
  // confirmed live.
  sent: boolean;

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
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [optimisticMatchState, setOptimisticMatchState] = useState<MatchState | null>(null);
  const [lastActionUnconfirmed, setLastActionUnconfirmed] = useState(false);
  const [predictionDiverged, setPredictionDiverged] = useState(false);

  const lastRequestNumber = useRef(0);

  // makeAction and handleServerResponse below need synchronous access to the current
  // pendingActions, matchState and connectionStatus, without depending on them
  // directly - they change frequently and would invalidate moves/events on every
  // render, or be stale across rapid clicks within the same render.
  const pendingActionsRef = useRef(pendingActions);
  pendingActionsRef.current = pendingActions;
  const matchStateRef = useRef(matchState);
  matchStateRef.current = matchState;

  // Whether the current connection has had its wsClientConnection broadcast
  // received - i.e. whether sendMatchRequest right now would go straight to a
  // server-accepted socket rather than react-use-websocket's queue. Starts true:
  // this hook only mounts once serverResponse is non-null, which requires the
  // connection's wsClientConnection to have already arrived.
  const connectionConfirmedRef = useRef(true);

  // A closed connection invalidates confirmation: the next socket is not
  // server-accepted until its wsClientConnection broadcast arrives (set back to true
  // in handleConnectionConfirmed), even though onOpen will report status 'connected'
  // first. Done in the render body to keep this hook effect-free.
  if (connectionStatus !== 'connected' && connectionStatus !== 'connecting') {
    connectionConfirmedRef.current = false;
  }

  // Update pendingActions and its ref together, so synchronous reads via
  // pendingActionsRef stay in sync with the state used for rendering.
  const setPending = useCallback((next: PendingAction[]) => {
    pendingActionsRef.current = next;
    setPendingActions(next);
  }, []);

  // Clear the pending queue and any optimistic prediction - used whenever a response
  // can no longer be trusted (lost connection, out-of-order response, or a diverged
  // prediction) and the board should fall back to the server's state.
  const dropPendingQueue = useCallback(() => {
    setPending([]);
    setOptimisticMatchState(null);
  }, [setPending]);

  // Handle a wsClientConnection broadcast confirmed (by the dispatcher below) to be
  // about this player's own connection. It proves this connection is live and
  // accepted - the server just sent a message over it - and carries authoritative
  // state, but isn't tied to any particular request. The right response depends on how
  // the oldest pending action (if any) was sent:
  //
  // Scenario A (sent = true): sent over a connection that has since dropped. The
  // response may never arrive, and everything chained on top of it is unverifiable.
  // Drop the whole queue and fall back to the server's state.
  //
  // Scenario B (sent = false): created while disconnected/unconfirmed and never
  // transmitted. This broadcast confirms the connection is now live and accepted, so
  // send every not-yet-sent pending action now, in order, directly on this socket.
  const handleConnectionConfirmed = useCallback(() => {
    connectionConfirmedRef.current = true;

    const pending = pendingActionsRef.current;

    if (pending.length > 0 && pending[0].sent) {
      dropPendingQueue();
      setLastActionUnconfirmed(true);
      return;
    }

    if (pending.length > 0) {
      const next = pending.map((p) => {
        if (p.sent) return p;
        sendMatchRequest({ id: p.id, action: p.action });
        return { ...p, sent: true };
      });
      setPending(next);
    }
  }, [dropPendingQueue, sendMatchRequest, setPending]);

  // Handle a response to one of this player's own action requests (move/endTurn/
  // endMatch). Responses are delivered in order and exactly once, so the response
  // always corresponds to the head of the queue. (Defensive check below in case that
  // guarantee is ever violated.)
  const handleActionResponse = useCallback(
    (trigger: WsClientRequest, response: WsServerResponse) => {
      const pending = pendingActionsRef.current;

      if (pending.length === 0) {
        // Response for an action whose entry was already dropped after an earlier
        // divergence - the displayed state already tracks the server's matchState
        // directly.
        return;
      }

      const prediction = pending[0];
      if (!sameRequestID(prediction.id, trigger.id)) {
        console.error('Response received out of order - expected response for a different action', {
          expectedId: prediction.id,
          responseId: trigger.id,
        });
        dropPendingQueue();
        setPredictionDiverged(true);
        setLastActionUnconfirmed(false);
        return;
      }

      if (predictionMatches(prediction.predictedState, response.matchState)) {
        const rest = pending.slice(1);
        setPending(rest);
        if (rest.length === 0) {
          setOptimisticMatchState(null);
        }
      } else {
        console.error('Optimistic prediction diverged from server response', {
          predicted: prediction.predictedState,
          actual: response.matchState,
        });
        dropPendingQueue();
        setPredictionDiverged(true);
      }

      setLastActionUnconfirmed(false);
    },
    [dropPendingQueue, setPending],
  );

  // Called by useServerConnection, in order and exactly once, for every server
  // response - see responseHandlerRef in use-server-connection.ts. Dispatches to the
  // two handlers above based on what triggered the response.
  const handleServerResponse = useCallback(
    (response: WsServerResponse) => {
      const { trigger } = response;

      if (isWsClientConnection(trigger)) {
        if (trigger.playerId === player.id) {
          handleConnectionConfirmed();
        }
        return;
      }

      if (!isWsClientRequest(trigger)) {
        return; // badClientRequest / unknownProblem - not relevant to the queue.
      }

      if (trigger.id.playerId !== player.id) {
        return; // another player's broadcast.
      }

      handleActionResponse(trigger, response);
    },
    [handleActionResponse, handleConnectionConfirmed, player.id],
  );

  responseHandlerRef.current = handleServerResponse;

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

      const sent = connectionConfirmedRef.current;
      if (sent) {
        sendMatchRequest({ id, action });
      }

      setPending([...pending, { id, action, sent, predictedState }]);
    },
    [appGame, player.id, sendMatchRequest, setPending],
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
      matchState: optimisticMatchState ?? matchState,
    }),
    [
      moves,
      events,
      waitingForServer,
      lastActionUnconfirmed,
      predictionDiverged,
      optimisticMatchState,
      matchState,
    ],
  );
}
