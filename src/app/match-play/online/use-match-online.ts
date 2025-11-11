import { AppGame, MatchID, Player } from "@/app-game-support";
import { serverAddress } from "@shared/server-address";
import { ServerMatchData, WsMatchResponse } from "@shared/ws-match-response";
import { WsEndTurn, WsMoveRequest, isWsMoveRequest } from "@shared/ws-match-request";
import useWebSocket, {ReadyState} from "react-use-websocket";

// A move function as run on a client.
type MatchMove = (arg0: {
    activePlayer: number,
    arg: unknown,
}) => void;

interface Match<GameState = unknown>  extends ServerMatchData<GameState> {
    moves: Record<string, MatchMove>;
    endTurn: () => void;
}

/** Status of a match on the server or psuedo-server. */
type OnlineMatchResult = {
    readyState: ReadyState; // Use if the connection is not open

    match: Match | null ;  // Can be null after initial connection, or after
                    // certain errors are detected by the server.

    error: string | null; // Set if an exception occured during the last move, or if the
                    // last move was found to be illegal (e.g. the wrong player
                    // tried to move).  In this cases, the match state will not
                    // changed.
                    // If set, it shows there is a bug somewhere (or at least
                    // some less-than-ideal code). 
};

export function useOnlineMatch(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchResult {
    
    const url = new URL(serverAddress());
    url.protocol = "ws";
    url.searchParams.append("matchID", matchID.mid);
    url.searchParams.append("playerID", player.id);
    url.searchParams.append("credentials", player.credentials);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url.toString());
    if ( !lastJsonMessage ) {
        return { readyState, match: null, error: null };
    }

    const { error, matchData } = lastJsonMessage as WsMatchResponse;
    if ( !matchData ) {
        return { readyState, error, match: null };
    }


    // Inefficient, but simple. (Functions are recreated on every call.)
    const matchMoves: Record<string, MatchMove> = {};
    for (const moveName in appGame.moves) {
        matchMoves[moveName] = makeMatchMove(moveName, sendJsonMessage);
    }

    const endTurn: WsEndTurn = { endTurn: true };
    
    const match : Match = {
        ...matchData,
        moves: matchMoves,
        endTurn: () => sendJsonMessage(endTurn),
    };
    
    return { readyState, error, match };
}

function makeMatchMove(
    moveName: string, 
    sendJsonMessage: (message: unknown) => void,
) : MatchMove {
    return (arg) => {

        const moveRequest : WsMoveRequest = {
            move: moveName,
            arg,
        };

        if (!isWsMoveRequest(moveRequest)) {
            console.error("Unexpected move data: " + JSON.stringify(moveRequest));
        }   
        sendJsonMessage(moveRequest);
    };
}

