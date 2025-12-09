import { MatchID, Player } from "@/app-game-support";
import { OnlineConnectionStatus } from "@/app-game-support/board-props";
import { serverAddress } from "@shared/server-address";
import { WsClientRequest } from "@shared/ws-client-request";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { readyStatusText } from "@utils/ready-status-text";
import { isWsServerResponse, WsServerResponse } from "@shared/ws-server-response";

// A fairly thin wrapper around useWebSocket.
export function useServerConnection(
    { matchID, player }: { matchID: MatchID; player: Player; }
): {
        connectionStatus: OnlineConnectionStatus;

        /** serverResponse will be missing during initial loading, or following
         * certain errors, e.g. a failure to connect to the server.
        */
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

    let error: string | null = null;
    let serverResponse: WsServerResponse | null = null;

    if (lastJsonMessage) {
        if(isWsServerResponse(lastJsonMessage)) {
            serverResponse = lastJsonMessage;
        } else {
            error = "Invalid WebSocket message format: expected a valid WsMatchResponse object." 
                + "Received: " + JSON.stringify(lastJsonMessage);
        }
    }

    const connectionStatus: OnlineConnectionStatus = {
        readyState,
        error,
    };

    return { connectionStatus, serverResponse, sendMatchRequest: sendJsonMessage };
}
