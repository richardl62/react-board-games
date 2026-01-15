import { MatchID, Player } from "@/app-game-support";
import { WsClientRequest } from "@shared/ws-client-request";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { readyStatusText } from "@utils/ready-status-text";
import { isWsServerResponse, WsServerResponse } from "@shared/ws-server-response";
import { ReadyState } from "react-use-websocket";
import { serverAddress } from "../../server-address";

// A fairly thin wrapper around useWebSocket.
export function useServerConnection(
    { matchID, player }: { matchID: MatchID; player: Player; }
): {
        readyState: ReadyState;

        // Null while connecting.
        serverResponse: WsServerResponse | null;

        // A match request can be a move or an event like end turn.
        sendMatchRequest: (request: WsClientRequest) => void;

        // Indicate that a reconnection is being attemped.
        reconnecting: boolean;
    } {
    const url = new URL(serverAddress());

    url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    url.searchParams.append("matchID", matchID.mid);
    url.searchParams.append("playerID", player.id);
    url.searchParams.append("credentials", player.credentials);

    const [reconnecting, setReconnecting] = useState(false);
    const hasEverOpenedRef = useRef(false);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url.toString(), {
        retryOnError: true,
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: (attemptNumber) => {
            const inteval =Math.min(1000 * Math.pow(2, attemptNumber), 20000) + Math.floor(Math.random() * 1000)
            console.log(`WebSocket: reconnect attempt ${attemptNumber}, next in ${inteval/1000} seconds`);
            return inteval; 
        },
        onReconnectStop: (attempts) => {
            console.warn(`WebSocket: stopped reconnecting after ${attempts} attempts`);
            setReconnecting(false);
        },
        onOpen: () => {
            hasEverOpenedRef.current = true;
            setReconnecting(false);
        },
        onClose: () => {
            if (hasEverOpenedRef.current) setReconnecting(true);
        },
        onError: () => {
            if (hasEverOpenedRef.current) setReconnecting(true);
        }
    });
    
    useEffect(() => {
        console.log("WebSocket readyState:", readyStatusText(readyState), new Date().toLocaleTimeString());
    }, [readyState]);

    // Derive reconnecting state on transitions as an additional safeguard
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            hasEverOpenedRef.current = true;
            setReconnecting(false);
        } else if (readyState === ReadyState.CONNECTING && hasEverOpenedRef.current) {
            setReconnecting(true);
        }
    }, [readyState]);


    let serverResponse: WsServerResponse | null = null;

    if (lastJsonMessage) {
        if(isWsServerResponse(lastJsonMessage)) {
            serverResponse = lastJsonMessage;

        } else {
            // Not sure what best to do here, but hopefully it will not happen.
            console.warn("Received invalid WebSocket message:", lastJsonMessage)

            serverResponse = {
                trigger: { unknownProblem: true },
                connectionError: "Received invalid server response",
            }
        }
    }

    return { readyState, serverResponse, sendMatchRequest: sendJsonMessage, reconnecting };
}
