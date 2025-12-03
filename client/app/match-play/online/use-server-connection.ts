import { MatchID, Player } from "@/app-game-support";
import { serverAddress } from "@shared/server-address";
import { WsMatchRequest } from "@shared/ws-match-request";
import { ServerMatchData, isWsMatchResponse } from "@shared/ws-match-response";
import useWebSocket, { ReadyState } from "react-use-websocket";

// A fairly thin wrapper around useWebSocket.
export function useServerConnection(
    { matchID, player }: { matchID: MatchID; player: Player; }
): {
        readyState: ReadyState;
        error: string | null;

        /** Match data will be missing during initial loading, or following
         * certain errors.
        */
        serverMatchData: ServerMatchData | null;

        // A match request can be a move or an event like end turn.
        sendMatchRequest: (request: WsMatchRequest) => void;
    } {
    const url = new URL(serverAddress());

    url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    url.searchParams.append("matchID", matchID.mid);
    url.searchParams.append("playerID", player.id);
    url.searchParams.append("credentials", player.credentials);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url.toString());


    let error: string | null = null;
    let serverMatchData: ServerMatchData | null = null;

    if (lastJsonMessage) {
        if(!isWsMatchResponse(lastJsonMessage)) {
            throw new Error("Invalid WebSocket message format: expected a valid WsMatchResponse object." 
                + "Received: " + JSON.stringify(lastJsonMessage));
        }

        error = lastJsonMessage.error;
        serverMatchData = lastJsonMessage.matchData;
    }
    
    return { readyState, error, serverMatchData, sendMatchRequest: sendJsonMessage };
}
