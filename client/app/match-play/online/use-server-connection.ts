import { MatchID, Player } from "@/app-game-support";
import { wsUnknownProblem } from "@shared/ws-response-trigger";
import { isWsServerResponse, WsServerResponse } from "@shared/ws-server-response";
import { useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { serverAddress } from "../../server-address";
import { WsClientRequest } from "@shared/ws-client-request";

const reconnectAttempts = 30;
const minReconnectinterval = 1000; // 1 second
const maxReconnectInterval = 20000; // 20 seconds

interface ServerConnection {
    readyState: number;
    serverResponse: WsServerResponse | null;
    sendMatchRequest: (data: WsClientRequest) => void;
    reconnecting: boolean;
    rejectionReason: string | null;
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

    const [reconnecting, setReconnecting] = useState(false);
    const hasEverOpenedRef = useRef(false);
    const rejectedReasonRef = useRef<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
        retryOnError: true,
        reconnectAttempts,
        
        shouldReconnect: (event) => {
            // Stop if we found a terminal error (4xxx code or explicit reason)
            if (rejectedReasonRef.current) return false;
            const code = event?.code;
            return !(code !== undefined && code >= 4000 && code < 5000);
        },

        reconnectInterval: (attempt) => {
            const delay = 
                Math.min(minReconnectinterval * Math.pow(2, attempt), maxReconnectInterval) + 
                Math.floor(Math.random() * 1000) // Jitter to avoid thundering herd problem
            ;
            console.log(`WebSocket: reconnect attempt ${attempt}, next in ${delay / 1000}s`);
            return delay;
        },

        onOpen: () => {
            hasEverOpenedRef.current = true;
            setReconnecting(false);
        },

        onClose: (event) => {
            if (hasEverOpenedRef.current) setReconnecting(true);
            console.log(`connection closed: ${event.reason}`);
            if (event.reason)setRejectionReason(event.reason);
        },

        onError: () => {
            if (hasEverOpenedRef.current) setReconnecting(true);
        },
    });

    // Process the server response
    const serverResponse = useMemo((): WsServerResponse | null => {
        if (!lastJsonMessage) return null;

        if (isWsServerResponse(lastJsonMessage)) {
            // Capture terminal server-side errors
            if (lastJsonMessage.connectionError) {
                rejectedReasonRef.current = lastJsonMessage.connectionError;
                setReconnecting(false);
            }
            return lastJsonMessage;
        }

        console.warn("Received invalid WebSocket message:", lastJsonMessage);
        return {
            trigger: wsUnknownProblem,
            connectionError: "Received invalid server response",
        };
    }, [lastJsonMessage]);

    return { 
        readyState, 
        serverResponse, 
        sendMatchRequest: sendJsonMessage, 
        reconnecting,
        rejectionReason, 
    };
}