import { MatchID, Player } from "@/app-game-support";
import { isWsServerResponse, WsServerResponse } from "@shared/ws-server-response";
import { useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { serverAddress } from "../../server-address";
import { WsClientRequest } from "@shared/ws-client-request";
import { WsTestAction } from "@shared/ws-test-actions";

export type ConnectionStatus = "connecting" | "connected" | {
    closeEvent: CloseEvent,
    reconnecting: boolean,
}

const reconnectAttempts = 30;
const minReconnectInterval = 1000; // 1 second
const maxReconnectInterval = 20000; // 20 seconds

export interface ServerConnection {
    connectionStatus: ConnectionStatus;

    serverResponse: WsServerResponse | null;
    sendMatchRequest: (data: WsClientRequest | WsTestAction) => void;

    // True immediately after a reconnect during which queued messages were flushed to the server.
    // Allows useOnlineMatchActions to distinguish "response lost during disconnect" (clear
    // in-flight state) from "move was queued and just sent" (leave in-flight state intact).
    flushedQueueOnReconnect: { readonly current: boolean };
}

export function useServerConnection({ matchID, player }: { matchID: MatchID; player: Player }) : ServerConnection {
    const socketUrl = useMemo(() => {
        const url = new URL(serverAddress());
        url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        url.searchParams.append("matchID", matchID.mid);
        url.searchParams.append("playerID", player.id);
        url.searchParams.append("credentials", player.credentials);
        return url.toString();
    }, [matchID.mid, player.id, player.credentials]);

    const attemptReconnection = useRef(false);
    const isConnectedRef = useRef(false);
    const queuedMessageCount = useRef(0);
    const flushedQueueOnReconnect = useRef(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>( "connecting" );

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl, {
        retryOnError: true,
        reconnectAttempts,

        shouldReconnect: () => {
            return attemptReconnection.current;
        },

        onReconnectStop: () => {
            setConnectionStatus((prev) => {
                if (prev === "connecting" || prev === "connected") {
                    // I'm not sure if this can even happen, but just in case.
                    return {
                        closeEvent: new CloseEvent('close', { reason: "Failed to connect after maximum attempts" }),
                        reconnecting: false
                    }
                }
 
                return { ...prev, reconnecting: false };
            });
        },

        reconnectInterval: (attempt) => {
            const delay = 
                Math.min(minReconnectInterval * Math.pow(2, attempt), maxReconnectInterval) + 
                Math.floor(Math.random() * 1000) // Jitter to avoid thundering herd problem
            ;
            console.log(`WebSocket: reconnect attempt ${attempt}, next in ${delay / 1000}s`);
            return delay;
        },

        onOpen: () => {
            flushedQueueOnReconnect.current = queuedMessageCount.current > 0;
            queuedMessageCount.current = 0;
            isConnectedRef.current = true;
            attemptReconnection.current = false;
            setConnectionStatus("connected");
        },

        onClose: (event) => {
            isConnectedRef.current = false;
            attemptReconnection.current = !( event.code >= 4000 && event.code < 5000);

            setConnectionStatus({
                closeEvent: event,
                reconnecting: attemptReconnection.current,
            });
        },

        // onError could be used here. But onClose will almost always be called after an error,
        // so it's not clear that there would be anything useful to do.
    });

    // Process the server response
    const serverResponse = useMemo((): WsServerResponse | null => {
        if (!lastJsonMessage) return null;

        if (!isWsServerResponse(lastJsonMessage)) {
            // Should never happen ...
            console.warn("Received invalid WebSocket message:", lastJsonMessage);
            attemptReconnection.current = false;
            return null;
        }

        return lastJsonMessage
    }, [lastJsonMessage]);

    const sendMatchRequest = (data: WsClientRequest | WsTestAction) => {
        if (!isConnectedRef.current) {
            queuedMessageCount.current += 1;
        }
        sendJsonMessage(data);
    };

    return {
        serverResponse,
        sendMatchRequest,
        connectionStatus,
        flushedQueueOnReconnect,
    };
}