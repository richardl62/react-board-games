import { AppGame, BoardProps, ConnectionStatus, MatchID, Player } from "@/app-game-support";
import { ServerMatchData } from "@shared/ws-match-response";
import { WsEndMatch, WsEndTurn } from "@shared/ws-match-request";
import { EventsAPI } from "@shared/game-control/events";
import { useServerConnection } from "./use-server-connection";
import { useEffect, useMemo, useState } from "react";

/** Data about a match received from the server, with added move functions
 * and events. */
export interface OnlineMatchData {
    connectionStatus: ConnectionStatus;

    // Null while data is initially loading. After that, set to the last
    // non-null value received from the server.
    serverMatchData: ServerMatchData | null;

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

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { readyState, serverMatchData, error, sendMatchRequest } = useServerConnection({matchID, player});

    const moves: BoardProps["moves"] = useMemo(() => {
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

    const lastServerMatchData = useLastNonNull(serverMatchData);

    const connectionStatus: ConnectionStatus = {
        readyStatus: readyState,
        error,
        staleGameState: serverMatchData !== lastServerMatchData,
    };
    
    return { connectionStatus, serverMatchData: lastServerMatchData, moves, events };
}

