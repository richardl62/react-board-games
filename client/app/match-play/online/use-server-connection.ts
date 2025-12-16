import { MatchID, Player } from "@/app-game-support";
import { WsClientRequest } from "@shared/ws-client-request";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { readyStatusText } from "@utils/ready-status-text";
import { isWsServerResponse, WsServerResponse } from "@shared/ws-server-response";
import { ReadyState } from "react-use-websocket";
import { serverAddress } from "../../server-address";

// A thin wrapper around useWebSocket.
export function useServerConnection(
    { matchID, player }: { matchID: MatchID; player: Player; }
): {
        readyState: ReadyState;

        // Null while connecting.
        serverResponse: WsServerResponse | null;

        // A match request can be a move or an event like end turn.
        sendMatchRequest: (request: WsClientRequest) => void;
    } {
    const url = new URL(serverAddress());

    url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    url.searchParams.append("matchID", matchID.mid);
    url.searchParams.append("playerID", player.id);
    url.searchParams.append("credentials", player.credentials);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url.toString());
    
    useEffect(() => {
        console.log("WebSocket readyState:", readyStatusText(readyState), new Date().toLocaleTimeString());
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

    return { readyState, serverResponse, sendMatchRequest: sendJsonMessage };
}
