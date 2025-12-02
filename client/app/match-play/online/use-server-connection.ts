import { MatchID, Player } from "@/app-game-support";
import { serverAddress } from "@shared/server-address";
import { WsMatchRequest } from "@shared/ws-match-request";
import { ServerMatchData, isWsMatchResponse } from "@shared/ws-match-response";
import useWebSocket, { ReadyState } from "react-use-websocket";

export function useServerConnection(
    { matchID, player }: { matchID: MatchID; player: Player; }
): {
        readyState: ReadyState;
        error: string | null;

        /** Match data will be missing following certain errors
         * Should always be set when the connection is open and no errors
         * are reported.
        */
        matchData: ServerMatchData | null;

        // A match request can be a move or an event like end turn.
        // Should not be used if the matchResponse is null. (TO DO:
        // consider rolling this into matchData to enforce this rule.)
        sendMatchRequest: (request: WsMatchRequest) => void;
    } {
    const url = new URL(serverAddress());
    url.protocol = "ws";
    url.searchParams.append("matchID", matchID.mid);
    url.searchParams.append("playerID", player.id);
    url.searchParams.append("credentials", player.credentials);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url.toString());

    if (!lastJsonMessage) {
        return {
            readyState,
            error: null,
            matchData: null,
            sendMatchRequest: () => {
                throw new Error("Match request attempted when match data is not available.");
            }
        };
    }

    if (!isWsMatchResponse(lastJsonMessage)) {
        throw new Error("Unexpected server response: " + JSON.stringify(lastJsonMessage));
    }

    const { error, matchData } = lastJsonMessage;

    if (readyState === ReadyState.OPEN && !error && !matchData) {
        throw new Error("No match data received from server when connection is open and no error reported.");
    }
    return { readyState, error, matchData, sendMatchRequest: sendJsonMessage };
}
