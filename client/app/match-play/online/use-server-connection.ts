import { MatchID, Player } from '@/app-game-support/types';
import { isWsServerResponse, WsServerResponse } from '@shared/ws-server-response';
import { RefObject, useMemo, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { serverAddress } from '../../server-address';
import { WsClientRequest } from '@shared/ws-client-request';
import { WsTestAction } from '@shared/ws-test-actions';

/** Status of connection with server. For closed connections includes
 * indication of whether reconnection is being attempted.
 */
export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | {
      closeEvent: CloseEvent;
      reconnecting: boolean;
    };

/** Human-readable description of why a connection closed: the server-supplied reason
 * if there is one, otherwise the numeric close code. */
export function describeClose(closeEvent: CloseEvent): string {
  return closeEvent.reason || `closure code ${closeEvent.code}`;
}

const reconnectAttempts = 30;
const minReconnectInterval = 1000; // 1 second
const maxReconnectInterval = 20000; // 20 seconds

export interface ServerConnection {
  connectionStatus: ConnectionStatus;

  serverResponse: WsServerResponse | null;
  sendMatchRequest: (data: WsClientRequest | WsTestAction) => void;

  // Registered by useOnlineMatchActions with a callback to be invoked, in order and
  // exactly once, for every server response - see onMessage below.
  responseHandlerRef: RefObject<(response: WsServerResponse) => void>;
}

export function useServerConnection({
  matchID,
  player,
}: {
  matchID: MatchID;
  player: Player;
}): ServerConnection {
  const socketUrl = useMemo(() => {
    const url = new URL(serverAddress());
    url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    url.searchParams.append('matchID', matchID.mid);
    url.searchParams.append('playerID', player.id);
    url.searchParams.append('credentials', player.credentials);
    return url.toString();
  }, [matchID.mid, player.id, player.credentials]);

  const attemptReconnection = useRef(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [serverResponse, setServerResponse] = useState<WsServerResponse | null>(null);
  const responseHandlerRef = useRef<(response: WsServerResponse) => void>(() => undefined);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    retryOnError: true,
    reconnectAttempts,

    shouldReconnect: () => {
      return attemptReconnection.current;
    },

    onReconnectStop: () => {
      setConnectionStatus((prev) => {
        if (prev === 'connecting' || prev === 'connected') {
          // I'm not sure if this can even happen, but just in case.
          return {
            closeEvent: new CloseEvent('close', {
              reason: 'Failed to connect after maximum attempts',
            }),
            reconnecting: false,
          };
        }

        return { ...prev, reconnecting: false };
      });
    },

    reconnectInterval: (attempt) => {
      const delay =
        Math.min(minReconnectInterval * Math.pow(2, attempt), maxReconnectInterval) +
        Math.floor(Math.random() * 1000); // Jitter to avoid thundering herd problem
      console.log(`WebSocket: reconnect attempt ${attempt}, next in ${delay / 1000}s`);
      return delay;
    },

    onOpen: () => {
      attemptReconnection.current = false;
      setConnectionStatus('connected');
    },

    onClose: (event) => {
      attemptReconnection.current = !(event.code >= 4000 && event.code < 5000);

      setConnectionStatus({
        closeEvent: event,
        reconnecting: attemptReconnection.current,
      });
    },

    // onError could be used here. But onClose will almost always be called after an error,
    // so it's not clear that there would be anything useful to do.

    // Called synchronously, once per message, in arrival order - the single point
    // where incoming messages are parsed and dispatched to (a) serverResponse, for
    // display, and (b) responseHandlerRef, for processing the pending-actions queue.
    onMessage: (event) => {
      let data: unknown;
      try {
        data = JSON.parse(event.data as string);
      } catch {
        console.warn('Received unparseable WebSocket message:', event.data);
        attemptReconnection.current = false;
        return;
      }

      if (!isWsServerResponse(data)) {
        // Should never happen ...
        console.warn('Received invalid WebSocket message:', data);
        attemptReconnection.current = false;
        return;
      }

      setServerResponse(data);
      responseHandlerRef.current(data);
    },
  });

  return {
    serverResponse,
    sendMatchRequest: sendJsonMessage,
    connectionStatus,
    responseHandlerRef,
  };
}
