import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { serverAddress } from "@shared/server-address";
import { isWsMatchResponse, ServerMatchData } from "@shared/ws-match-response";
import { WsEndMatch, WsEndTurn, WsMatchRequest } from "@shared/ws-match-request";
import useWebSocket, {ReadyState} from "react-use-websocket";
import { EventsAPI } from "@shared/game-control/events";
import { useCallback } from "react";

function useServerConnection(
    {matchID, player}: {matchID: MatchID, player: Player},
) : {
    readyState: ReadyState; 
    error: string | null;

    /** Match data will be missing following certain errors 
     * Should always be set when the connection is open and no errors
     * are reported.
    */
    matchData: ServerMatchData | null; 

    // A match request can be a move or an event like end turn.
    // KLUDGE? Should not be used if the matchResponse is null.
    sendMatchRequest: (request: WsMatchRequest) => void;
} {
    const url = new URL(serverAddress());
    url.protocol = "ws";
    url.searchParams.append("matchID", matchID.mid);
    url.searchParams.append("playerID", player.id);
    url.searchParams.append("credentials", player.credentials);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url.toString());

    const sendMatchRequest = useCallback((request: WsMatchRequest) => {
        sendJsonMessage(request);
    }, [sendJsonMessage]);

    if (!lastJsonMessage) {
        return {
            readyState,
            error: null,
            matchData: null,
            sendMatchRequest: () => {
                throw new Error("No connection established");
            }
        }
    }

    if (!isWsMatchResponse(lastJsonMessage)) {
        throw new Error("Unexpected server response: " + JSON.stringify(lastJsonMessage));
    }

    const { error, matchData } = lastJsonMessage;

    if ( readyState === ReadyState.OPEN && !error && !matchData ) {
        throw new Error("No match data received from server when connection is open and no error reported.");
    }
    return { readyState, error, matchData,sendMatchRequest };
}

/** Data about a match received from the server, with added move functions
 * and events. Grouped together to ensure that either all or none of the 
 * data is present.
 */
interface MatchData<GameState = unknown>  extends ServerMatchData<GameState> {
    moves: BoardProps["moves"];
    events: EventsAPI;
}

/** Status of a match on the server or psuedo-server. */
export interface OnlineMatchData {
    readyState: ReadyState; // Use if the connection is not open

    matchData: MatchData | null ;  // Can be null after initial connection, or after
                    // certain errors are detected by the server.

    error: string | null; // Set if an exception occured during the last move, or if the
                    // last move was found to be illegal (e.g. the wrong player
                    // tried to move).  In this cases, the match state will not
                    // changed.
                    // If set, it shows there is a bug somewhere (or at least
                    // some less-than-ideal code). 
};

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { readyState, matchData, error, sendMatchRequest } = useServerConnection({matchID, player});

    // Inefficient, but simple. (Functions are recreated on every call.)
    const matchMoves: BoardProps["moves"] = {};
    for (const moveName of Object.keys(appGame.moves)) {
        matchMoves[moveName] = (arg) => sendMatchRequest({
            move: moveName,
            arg,
        });
    }

    if (!matchData) {
        return {
            readyState,
            matchData: null,
            error: null,
        };
    }

    const match : MatchData = {
        ...matchData,
        moves: matchMoves,
        events: {
            endTurn: () => sendMatchRequest(WsEndTurn),
            endMatch: () => sendMatchRequest(WsEndMatch),
        },
    };
    
    return { readyState, error, matchData: match };
}

