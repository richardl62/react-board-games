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

// Return actions - moves and events - suitable for an online game.
// Also return status information about the action requested, and the optimistic
// (locally-predicted) match state, if any action is currently in flight.
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
  const [awaitedResponses, setAwaitedResponses] = useState<WsRequestId[]>([]);
  const [lastActionIgnored, setLastActionIgnored] = useState(false);
  const [optimisticMatchState, setOptimisticMatchState] = useState<MatchState | null>(null);
  const [lastActionUnconfirmed, setLastActionUnconfirmed] = useState(false);

  // Storing the waiting status in a ref as well a 'direct' variable. The ref allows
  // for the (probably rare) case where a user triggers an action twice before the state
  // updates. The variable is for use in dependencies in later hooks (linters do not like
  // the use of waitingForServerRef.current as a dependency).
  const waitingForServer = awaitedResponses.length > 0;
  const waitingForServerRef = useRef(waitingForServer);
  waitingForServerRef.current = waitingForServer;

  const lastRequestNumber = useRef(0);

  // Check if the server response is due to a client action rather than, say,  a connection warning.
  const trigger = serverResponse?.trigger;
  const responseId = isWsClientRequest(trigger) ? trigger.id : null;

  // True if the most recent dispatched request was queued while disconnected (Scenario B)
  // rather than sent live (Scenario A). Used to decide whether wsClientConnection should
  // clear awaitedResponses (see effect below).
  const actionQueuedRef = useRef(false);

  useEffect(() => {
    if (responseId) {
      setAwaitedResponses((prev) => {
        const stillAwaited = prev.filter((id) => !sameRequestID(id, responseId));
        return stillAwaited.length !== prev.length ? stillAwaited : prev;
      });
      setOptimisticMatchState(null);
      setLastActionUnconfirmed(false);
      actionQueuedRef.current = false;
    }
  }, [responseId]);

  // The server's wsClientConnection broadcast (sent on every connect/disconnect) carries
  // authoritative state but isn't tied to any particular request. The right response
  // depends on how the in-flight request was sent:
  //
  // Scenario A (actionQueuedRef = false): request was sent live before the connection
  // dropped. The response may never arrive. Clear awaitedResponses to avoid being stuck.
  //
  // Scenario B (actionQueuedRef = true): request was queued while offline and has just
  // been flushed by react-use-websocket. The server sends wsClientConnection before
  // processing the freshly-arrived request, so the response is still coming. Leave
  // awaitedResponses intact; the responseId effect will clear when it arrives.
  useEffect(() => {
    if (trigger && isWsClientConnection(trigger)) {
      if (!actionQueuedRef.current) {
        if (waitingForServerRef.current) {
          // We were waiting for a response to a live request that may now never arrive.
          // The board is about to revert to the server's authoritative state, which may
          // not reflect the player's last action - let them know.
          setLastActionUnconfirmed(true);
        }
        setAwaitedResponses([]);
        setOptimisticMatchState(null);
      }
      actionQueuedRef.current = false;
    }
  }, [trigger]);

  // makeAction needs the current matchState and connectionStatus but must not depend on
  // either directly - both change frequently and would invalidate moves/events on every
  // render. Mirrors the waitingForServerRef pattern.
  const matchStateRef = useRef(matchState);
  matchStateRef.current = matchState;
  const connectionStatusRef = useRef(connectionStatus);
  connectionStatusRef.current = connectionStatus;

  const makeAction = useCallback(
    (action: WsRequestedAction) => {
      // Block only if already waiting for a prior action's response.
      // Disconnected is no longer a block: react-use-websocket queues the request and
      // flushes it on reconnect (sendJsonMessage keep=true, the default).
      const ignoreAction = waitingForServerRef.current;
      setLastActionIgnored(ignoreAction);

      if (ignoreAction) {
        return;
      }

      // The player is proceeding past any earlier unconfirmed action - they've seen
      // wherever the board ended up and are acting on it.
      setLastActionUnconfirmed(false);

      // Apply the action locally so it's reflected on the board immediately, exactly as
      // the offline game does. If local validation rejects it, show the resulting error
      // (just like offline) and don't bother sending it - the server would only reject it
      // identically, and the UI shouldn't be offering invalid actions in the first place.
      const optimistic = applyActionLocally(appGame, action, player.id, matchStateRef.current);
      setOptimisticMatchState(optimistic);
      if (optimistic.errorInLastAction !== null) {
        return;
      }

      lastRequestNumber.current += 1;
      const id: WsRequestId = { playerId: player.id, number: lastRequestNumber.current };
      setAwaitedResponses((prev) => [...prev, id]);
      waitingForServerRef.current = true;
      actionQueuedRef.current = connectionStatusRef.current !== 'connected';

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

  return useMemo(
    () => ({
      moves,
      events,
      actionRequestStatus: { waitingForServer, lastActionIgnored, lastActionUnconfirmed },
      optimisticMatchState,
    }),
    [moves, events, waitingForServer, lastActionIgnored, lastActionUnconfirmed, optimisticMatchState],
  );
}
