import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { ServerMatchData } from "@shared/ws-match-response";
import { WsEndMatch, WsEndTurn } from "@shared/ws-match-request";
import {ReadyState} from "react-use-websocket";
import { EventsAPI } from "@shared/game-control/events";
import { useServerConnection } from "./use-server-connection";
import { useMemo } from "react";

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

    const { readyState, matchData: serverMatchData, error, sendMatchRequest } = useServerConnection({matchID, player});

    const matchMoves: BoardProps["moves"] = useMemo(() => {
        const moves: BoardProps["moves"] = {};
        for (const moveName of Object.keys(appGame.moves)) {
            moves[moveName] = (arg) => sendMatchRequest({
                move: moveName,
                arg,
            });
        }
        return moves;
    }, [appGame.moves, sendMatchRequest]);

    const events: EventsAPI = useMemo(() => ({
        endTurn: () => sendMatchRequest(WsEndTurn),
        endMatch: () => sendMatchRequest(WsEndMatch),
    }), [sendMatchRequest]);

    let matchData: MatchData | null = null;
    if (serverMatchData !== null) {
        matchData = {
            ...serverMatchData,
            moves: matchMoves,
            events,
        };
    }
    
    return { readyState, error, matchData };
}

