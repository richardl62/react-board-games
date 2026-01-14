import { AppGame, BoardProps, ConnectionStatus, MatchID, Player } from "@/app-game-support";
import { useLastNonNull } from "@/utils/use-last-non-null";
import { EventsAPI } from "@shared/game-control/events";
import { ServerMatchData } from "@shared/server-match-data";
import { WsClientRequest } from "@shared/ws-client-request";
import { useServerConnection } from "./use-server-connection";
import { useAwaitedResponse } from "./use-awaited-response";

/** Data about a match received from the server, with added move functions
 * and events. */
export interface OnlineMatchData {
    connectionStatus: ConnectionStatus;

    reconnecting: boolean;

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

    const { 
        readyState, serverResponse, sendMatchRequest: rawSendRequest, reconnecting
    } = useServerConnection({matchID, player});

    const matchData = (serverResponse && serverResponse.matchData) || null;
    const lastServerMatchData = useLastNonNull(matchData); 

    const { awaitingResponse, addAwaitedResponse } = useAwaitedResponse(serverResponse, player);

    // To do: Consider memoizing the code below.
    const wrappedSendRequest = (action: WsClientRequest["action"]) => {
        return rawSendRequest({ id:addAwaitedResponse(), action });
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

    const connectionStatus: ConnectionStatus = {
        readyState,
        waitingForServer: awaitingResponse,
    };

    const connectionError = (serverResponse && serverResponse.connectionError) || null;
    return { connectionStatus, connectionError, serverMatchData: lastServerMatchData, moves, events, reconnecting };
}

