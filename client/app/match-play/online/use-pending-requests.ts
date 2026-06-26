// A game-agnostic reliability layer for request/response over the match WebSocket.
//
// Given a request and the response the caller expects it to produce, this hook gets
// the request to the server as reliably as the connection allows, reconciles the
// actual response against the expected one, and reports any problems. It is used by
// useOnlineMatchInfo to drive optimistic updates, but knows nothing about any
// particular game - or even about which actions are valid. The caller computes the
// expected state (predicting from predictionBase()) and submits it; locally-rejected
// actions are handled entirely by the caller and never reach this hook.
//
// The pending-request queue
// -------------------------
// `pendingRequests` is a FIFO of requests awaiting a server response. Each entry
// carries the state it is expected to produce. The caller chains predictions by
// building each one on top of predictionBase() - the chain tip, i.e. the last pending
// request's expected state, or the last server-confirmed matchState when the queue is
// empty - which lets several requests be in flight at once. The board shows that same
// chain tip (the returned matchState), so a move is always predicted from the state on
// display: matchState is the tip read from render state, predictionBase() is the tip
// read live from refs (see chainTip). They differ only within a single synchronous
// burst of submissions, where chaining off the live tip is what's wanted.
//
// Reconciliation
// --------------
// use-server-connection delivers responses to handleServerResponse in order and
// exactly once, so a response always corresponds to the head of the queue. If the
// server's state matches the head's expected state we pop the head (the rest of the
// chain stays valid); if it diverges - which should never happen, since the expected
// state is meant to mirror the server exactly - we treat it as a bug: drop the whole
// queue, fall back to the server's state, and set `predictionDiverged`.
//
// Sending only over a confirmed connection
// ----------------------------------------
// react-use-websocket has its own send queue, but it flushes the instant the socket
// reaches client-side OPEN, which may be a socket the server then rejects (e.g.
// during reconnection) - giving no delivery guarantee and silently losing requests.
// So we don't rely on it: a request is only sent (sent: true) once the connection is
// known to be server-accepted, proven by a wsClientConnection broadcast for our own
// player (connectionConfirmedRef). Requests made before then are held (sent: false)
// and flushed, in order, by handleConnectionConfirmed once that broadcast arrives.
// On reconnection, a request that *was* already sent over a now-dead connection is
// unverifiable (its response may be lost, and everything chained on it with it), so
// we drop the queue and warn via `lastActionUnconfirmed`.
//
// No effects; refs for synchronous reads
// ---------------------------------------
// State changes are driven by callbacks - submit (caller input) and
// handleServerResponse (registered on responseHandlerRef in use-online-match-info,
// invoked from use-server-connection's onMessage) - plus one render-body line; the
// hook has no useEffect. predictionBase, submit and handleServerResponse read
// pendingRequests and matchState through refs so they stay current without going
// stale across rapid submissions within a single render (predictionBase() reflects
// each preceding submit immediately, so a burst of submissions chains correctly).
import { WsClientRequest, WsRequestId, isWsClientRequest } from '@shared/ws-client-request';
import { WsRequestedAction } from '@shared/ws-requested-action';
import { useCallback, useRef, useState } from 'react';
import { ConnectionStatus, ServerConnection } from './use-server-connection';
import { MatchState } from '@shared/match-state';
import { isWsClientConnection } from '@shared/ws-response-trigger';
import { WsServerResponse } from '@shared/ws-server-response';

function sameRequestID(a: WsRequestId, b: WsRequestId) {
  return a.playerId === b.playerId && a.number === b.number;
}

interface PendingRequest {
  id: WsRequestId;
  action: WsRequestedAction;

  // True once sendMatchRequest has been called for this request. This will be done
  // only over a connection the server is known to have accepted (see submit and the
  // wsClientConnection handling in handleServerResponse). False means the request
  // hasn't been sent yet and must be sent as soon as the connection is confirmed
  // live.
  sent: boolean;

  // The match state this request is expected to produce, supplied by the caller when
  // the request was submitted.
  expected: MatchState;
}

// The fields of a MatchState that an expected state can be compared against. playerData
// is excluded: the prediction passes it through unchanged, but the server's copy can
// change independently as players connect/disconnect.
function predictableFields(matchState: MatchState) {
  const { ctxData, state, prngState, errorInLastAction } = matchState;
  return { ctxData, state, prngState, errorInLastAction };
}

function predictionMatches(
  predicted: MatchState,
  actual: MatchState,
  actingPlayerId: string,
): boolean {
  if (JSON.stringify(predictableFields(predicted)) !== JSON.stringify(predictableFields(actual))) {
    return false;
  }
  const predictedGameData = predicted.playerData.find((p) => p.id === actingPlayerId)?.gameData;
  const actualGameData = actual.playerData.find((p) => p.id === actingPlayerId)?.gameData;
  return JSON.stringify(predictedGameData) === JSON.stringify(actualGameData);
}

// The chain tip: the state the next prediction builds on and the state shown on the
// board - the last pending request's expected state, or the server's state when the
// queue is empty.
function chainTip(pending: PendingRequest[], serverMatchState: MatchState): MatchState {
  return pending.length > 0 ? pending[pending.length - 1].expected : serverMatchState;
}

export interface PendingRequests {
  // The state to display: the latest optimistic prediction if any requests are
  // pending, otherwise the server's authoritative state.
  matchState: MatchState;
  waitingForServer: boolean;
  lastActionUnconfirmed: boolean;
  predictionDiverged: boolean;

  // The state the caller should predict the next action on top of: the last pending
  // request's expected state, or the last server-confirmed state when none is pending.
  // A function (not a value) so it reflects requests submitted earlier in the same
  // render, keeping a rapid burst of submissions correctly chained.
  predictionBase: () => MatchState;

  // Display `expected` optimistically and send the request to the server.
  submit: (action: WsRequestedAction, expected: MatchState) => void;

  // Process a server response - registered on the connection's responseHandlerRef.
  handleServerResponse: (response: WsServerResponse) => void;
}

export function usePendingRequests(
  playerId: string,
  connectionStatus: ConnectionStatus,
  sendMatchRequest: ServerConnection['sendMatchRequest'],
  serverMatchState: MatchState,
): PendingRequests {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [lastActionUnconfirmed, setLastActionUnconfirmed] = useState(false);
  const [predictionDiverged, setPredictionDiverged] = useState(false);

  const lastRequestNumber = useRef(0);

  // predictionBase, submit and handleServerResponse below need synchronous access to
  // the current pendingRequests and matchState, without depending on them directly -
  // they change frequently and would be stale across rapid submissions within the
  // same render.
  const pendingRequestsRef = useRef(pendingRequests);
  pendingRequestsRef.current = pendingRequests;
  const matchStateRef = useRef(serverMatchState);
  matchStateRef.current = serverMatchState;

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

  // Update pendingRequests and its ref together, so synchronous reads via
  // pendingRequestsRef stay in sync with the state used for rendering.
  const setPending = useCallback((next: PendingRequest[]) => {
    pendingRequestsRef.current = next;
    setPendingRequests(next);
  }, []);

  // Clear the pending queue - used whenever a response can no longer be trusted (lost
  // connection, out-of-order response, or a diverged prediction). The displayed state
  // derives from the queue, so emptying it falls the board back to the server's state.
  const dropPendingQueue = useCallback(() => {
    setPending([]);
  }, [setPending]);

  // Handle a wsClientConnection broadcast confirmed (by the dispatcher below) to be
  // about this player's own connection. It proves this connection is live and
  // accepted - the server just sent a message over it - and carries authoritative
  // state, but isn't tied to any particular request. The right response depends on how
  // the oldest pending request (if any) was sent:
  //
  // Scenario A (sent = true): sent over a connection that has since dropped. The
  // response may never arrive, and everything chained on top of it is unverifiable.
  // Drop the whole queue and fall back to the server's state.
  //
  // Scenario B (sent = false): created while disconnected/unconfirmed and never
  // transmitted. This broadcast confirms the connection is now live and accepted, so
  // send every not-yet-sent pending request now, in order, directly on this socket.
  const handleConnectionConfirmed = useCallback(() => {
    connectionConfirmedRef.current = true;

    const pending = pendingRequestsRef.current;

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

  // Handle a response to one of this player's own requests. Responses are delivered
  // in order and exactly once, so the response always corresponds to the head of the
  // queue. (Defensive check below in case that guarantee is ever violated.)
  const handleActionResponse = useCallback(
    (trigger: WsClientRequest, response: WsServerResponse) => {
      const pending = pendingRequestsRef.current;

      if (pending.length === 0) {
        // Response for a request whose entry was already dropped after an earlier
        // divergence - the displayed state already tracks the server's matchState
        // directly.
        return;
      }

      const head = pending[0];
      if (!sameRequestID(head.id, trigger.id)) {
        console.error(
          'Response received out of order - expected response for a different request',
          {
            expectedId: head.id,
            responseId: trigger.id,
          },
        );
        dropPendingQueue();
        setPredictionDiverged(true);
        setLastActionUnconfirmed(false);
        return;
      }

      if (predictionMatches(head.expected, response.matchState, head.id.playerId)) {
        setPending(pending.slice(1));
      } else {
        console.error('Optimistic prediction diverged from server response', {
          predicted: head.expected,
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
        if (trigger.playerId === playerId) {
          handleConnectionConfirmed();
        }
        return;
      }

      if (!isWsClientRequest(trigger)) {
        return; // badClientRequest / unknownProblem - not relevant to the queue.
      }

      if (trigger.id.playerId !== playerId) {
        return; // another player's broadcast.
      }

      handleActionResponse(trigger, response);
    },
    [handleActionResponse, handleConnectionConfirmed, playerId],
  );

  // The live counterpart of the returned matchState: the chain tip read from refs
  // rather than render state. This matters when several requests are submitted in one
  // synchronous handler/effect (no re-render between them) - each then chains on the
  // previous one, which the rendered matchState wouldn't yet reflect.
  const predictionBase = useCallback(() => {
    return chainTip(pendingRequestsRef.current, matchStateRef.current);
  }, []);

  const submit = useCallback(
    (action: WsRequestedAction, expected: MatchState) => {
      // The caller is acting, so clear any earlier problem warning - they've seen
      // wherever the board ended up. (The predicted state shows on the board as soon as
      // setPending below appends it, since the displayed matchState derives from the
      // queue.)
      setLastActionUnconfirmed(false);
      setPredictionDiverged(false);

      lastRequestNumber.current += 1;
      const id: WsRequestId = { playerId, number: lastRequestNumber.current };

      const sent = connectionConfirmedRef.current;
      if (sent) {
        sendMatchRequest({ id, action });
      }

      setPending([...pendingRequestsRef.current, { id, action, sent, expected }]);
    },
    [playerId, sendMatchRequest, setPending],
  );

  return {
    matchState: chainTip(pendingRequests, serverMatchState),
    waitingForServer: pendingRequests.length > 0,
    lastActionUnconfirmed,
    predictionDiverged,
    predictionBase,
    submit,
    handleServerResponse,
  };
}
