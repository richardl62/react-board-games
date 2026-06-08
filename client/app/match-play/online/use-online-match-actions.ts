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

  const lastRequestNumber = useRef(0);

  // Check if the server response is due to a client action rather than, say,  a connection warning.
  const trigger = serverResponse?.trigger;
  const responseId = isWsClientRequest(trigger) ? trigger.id : null;

  useEffect(() => {
    if (responseId) {
      setAwaitedResponses((prev) => {
        const stillAwaited = prev.filter((id) => !sameRequestID(id, responseId));
        return stillAwaited.length !== prev.length ? stillAwaited : prev;
      });
      setOptimisticMatchState(null);
    }
  }, [responseId]);

  // The server's wsClientConnection broadcast (sent on every connect/disconnect) carries
  // authoritative state but isn't tied to any particular request. If it arrives while we're
  // waiting for a response, that response may never come (e.g. it was lost when the
  // connection dropped) - clear the wait rather than getting stuck. (There's a small chance
  // the original request *was* processed and its response merely lost, in which case the
  // player could end up repeating the action - but that's strictly better than being stuck.)
  useEffect(() => {
    if (trigger && isWsClientConnection(trigger)) {
      setAwaitedResponses([]);
      setOptimisticMatchState(null);
    }
  }, [trigger]);

  // Storing the waiting status in a ref as well a 'direct' variable. The ref allows
  // for the (probably rare) case where a user triggers an action twice before the state
  // updates. The variable is for use in dependencies in later hooks (linters do not like
  // the use of waitingForServerRef.current as a dependency).
  const waitingForServer = awaitedResponses.length > 0;
  const waitingForServerRef = useRef(waitingForServer);
  waitingForServerRef.current = waitingForServer;

  // makeAction needs the current matchState to apply actions locally, but it must not
  // depend on it directly - that would change on every server response and invalidate
  // moves/events on every render. Mirrors waitingForServerRef above.
  const matchStateRef = useRef(matchState);
  matchStateRef.current = matchState;

  const makeAction = useCallback(
    (action: WsRequestedAction) => {
      // Don't attempt an action if disconnected or if waiting for a response to
      // a prior action.
      const ignoreAction = connectionStatus !== 'connected' || waitingForServerRef.current;
      setLastActionIgnored(ignoreAction);

      if (ignoreAction) {
        return;
      }

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

      sendMatchRequest({ id, action });
    },
    [appGame, player.id, sendMatchRequest, connectionStatus],
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
      actionRequestStatus: { waitingForServer, lastActionIgnored },
      optimisticMatchState,
    }),
    [moves, events, waitingForServer, lastActionIgnored, optimisticMatchState],
  );
}
