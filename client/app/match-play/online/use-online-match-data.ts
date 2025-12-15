import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { useLastNonNull } from "@/utils/use-last-non-null";
import { EventsAPI } from "@shared/game-control/events";
import { ServerMatchData } from "@shared/server-match-data";
import { WsClientRequest, WsRequestId } from "@shared/ws-client-request";
import { useState } from "react";
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

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { readyState, serverMatchData, connectionError, 
        sendMatchRequest: rawSendRequest 
    } = useServerConnection({matchID, player});

    const [ lastRequestNumber, setLastRequestNumber ] = useState(0);

    // To do: Consider memoizing the code below.
    const wrappedSendRequest = (action: WsClientRequest["action"]) => {
        const requestNumber = lastRequestNumber + 1;
        setLastRequestNumber(requestNumber);

        const id: WsRequestId = { playerId: player.id, number: requestNumber}
        rawSendRequest({ id, action });
    }

    const moves: BoardProps["moves"] = {};
    for (const moveName of Object.keys(appGame.moves)) {
        moves[moveName] = (arg) => wrappedSendRequest({
            move: moveName,
            arg,
        });
    }

    const events: EventsAPI = {
        endTurn: () => wrappedSendRequest({ endTurn: true }),
        endMatch: () => wrappedSendRequest({ endMatch: true }),
    };

    const lastServerMatchData = useLastNonNull(serverMatchData);
    return { readyState, connectionError, serverMatchData: lastServerMatchData, moves, events };
}

