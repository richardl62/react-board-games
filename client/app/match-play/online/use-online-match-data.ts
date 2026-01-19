import { AppGame, BoardProps,  MatchID, Player } from "@/app-game-support";
import { useLastNonNull } from "@/utils/use-last-non-null";
import { EventsAPI } from "@shared/game-control/events";
import { ServerMatchData } from "@shared/server-match-data";
import { WsClientRequest } from "@shared/ws-client-request";
import { ConnectionStatus, useServerConnection } from "./use-server-connection";
import { useAwaitedResponse } from "./use-awaited-response";

/** Data about a match received from the server, with added move functions
 * and events. */
export interface OnlineMatchData {
    connectionStatus: ConnectionStatus;

    // True if waiting of the server to respond to a move or event.
    waitingForServer: boolean;

    // Null while data is initially loading. After that, set to the last
    // non-null value received from the server. This is intended to allow
    // for downstream code to continue working after a temporary loss of
    // connection.
    serverMatchData: ServerMatchData | null;

    moveError: string | null;

    moves: BoardProps["moves"];
    events: EventsAPI;
};

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { 
        serverResponse, sendMatchRequest: rawSendRequest, connectionStatus
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

    return { 
        connectionStatus, 
        waitingForServer: awaitingResponse, 
        serverMatchData: lastServerMatchData,
        moveError: serverResponse?.errorInAction || null,
        moves,
        events,
    };       
}

