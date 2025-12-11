import { MatchID, Player } from "@/app-game-support";
import { serverAddress } from "@shared/server-address";
import { WsClientRequest } from "@shared/ws-client-request";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { readyStatusText } from "@utils/ready-status-text";
import { isWsServerResponse } from "@shared/ws-server-response";
import { ReadyState } from "react-use-websocket";
import { ServerMatchData } from "@shared/server-match-data";

// A fairly thin wrapper around useWebSocket.
export function useServerConnection(
    { matchID, player }: { matchID: MatchID; player: Player; }
): {
        readyState: ReadyState;

        /** serverResponse will be null during initial loading, or when connectionError is set. */
        serverMatchData: ServerMatchData | null;

        connectionError: string | null;

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


    let serverMatchData: ServerMatchData | null = null;
    let connectionError: string | null = null;

    if (lastJsonMessage) {
        if(isWsServerResponse(lastJsonMessage)) {
            serverMatchData = lastJsonMessage.matchData || null;
            connectionError = lastJsonMessage.connectionError || null;

        } else {
            // Setting connectionError is a kludge, but it is hard to know what else to do.
            connectionError = "Invalid WebSocket message format: expected a valid WsMatchResponse object." 
                + "Received: " + JSON.stringify(lastJsonMessage);
        }
    }

    return { readyState, serverMatchData, connectionError, sendMatchRequest: sendJsonMessage };
}
