import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { useLastNonNull } from "@/utils/use-last-non-null";
import { EventsAPI } from "@shared/game-control/events";
import { ServerMatchData } from "@shared/server-match-data";
import { WsRequestId } from "@shared/ws-client-request";
import { useMemo } from "react";
import { ReadyState } from "react-use-websocket";
import { useServerConnection } from "./use-server-connection";

/** Data about a match received from the server, with added move functions
 * and events. */
export interface OnlineMatchData {
    readyState: ReadyState;

    // Null while data is initially loading. After that, set to the last
    // non-null value received from the server. This is intended to allow
    // for downstream code to continue working after a temporary loss of
    // connection.
    serverMatchData: ServerMatchData | null;

    // Set if there a problem preventing a valid connection to the server.
    // The possible errors include invalid IDs or credentials. If set there
    // is probably no point in downsteam code using serverMatchData.
    connectionError: string | null;

    moves: BoardProps["moves"];
    events: EventsAPI;
};

const dummyID: WsRequestId = {playerId: "dummy", number: -1};

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { readyState, serverMatchData, connectionError, sendMatchRequest } = useServerConnection({matchID, player});
    
    const moves: BoardProps["moves"] = useMemo(() => {
        
        const moves: BoardProps["moves"] = {};
        for (const moveName of Object.keys(appGame.moves)) {
            moves[moveName] = (arg) => sendMatchRequest({
                id: dummyID,
                move: moveName,
                arg,
            });
        }
        return moves;
    }, [appGame.moves, sendMatchRequest]);

    const events: EventsAPI = useMemo(() => ({
        endTurn: () => sendMatchRequest({id: dummyID, endTurn: true}),
        endMatch: () => sendMatchRequest({id: dummyID, endMatch: true}),
    }), [sendMatchRequest]);

    const lastServerMatchData = useLastNonNull(serverMatchData);
    return { readyState, connectionError, serverMatchData: lastServerMatchData, moves, events };
}

