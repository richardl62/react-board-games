import { AppGame, BoardProps, ConnectionStatus, MatchID, Player } from "@/app-game-support";
import { ServerMatchData } from "@shared/server-match-data";
import { EventsAPI } from "@shared/game-control/events";
import { useServerConnection } from "./use-server-connection";
import { useEffect, useMemo, useState } from "react";
import { WsRequestId } from "@shared/ws-client-request";


/** Data about a match received from the server, with added move functions
 * and events. */
export interface OnlineMatchData {
    connectionStatus: ConnectionStatus;

    // Null while data is initially loading. After that, set to the last
    // non-null value received from the server.
    serverMatchData: ServerMatchData | null;

    // Indicates an error that was caught and handled, e.g. an out-of-turn
    // move attempt, or and error thrown during a move.
    error: string | null;

    moves: BoardProps["moves"];
    events: EventsAPI;
};

// To do: Conider moving this to a more general location.
function useLastNonNull<T>(value: T | null): T | null {
    const [lastNonNull, setLastNonNull] = useState(value);
    useEffect(() => {
        if (value !== null) {
            setLastNonNull(value);
        }
    }, [value]);
    return lastNonNull;
}

const dummyID: WsRequestId = {playerId: "dummy", number: -1};

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { connectionStatus, serverResponse, sendMatchRequest } = useServerConnection({matchID, player});
    
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

    const lastServerMatchData = useLastNonNull(serverResponse?.matchData || null);
    const error = serverResponse?.error || null;
    return { connectionStatus, error, serverMatchData: lastServerMatchData, moves, events };
}

