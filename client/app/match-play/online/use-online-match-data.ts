import { AppGame, BoardProps, ConnectionStatus, MatchID, Player } from "@/app-game-support";
import { useLastNonNull } from "@/utils/use-last-non-null";
import { EventsAPI } from "@shared/game-control/events";
import { ServerMatchData } from "@shared/server-match-data";
import { isWsClientRequest, WsClientRequest, WsRequestId } from "@shared/ws-client-request";
import { useCallback, useEffect, useState } from "react";
import { useServerConnection } from "./use-server-connection";
import { WsServerResponse } from "@shared/ws-server-response";


/** Data about a match received from the server, with added move functions
 * and events. */
export interface OnlineMatchData {
    connectionStatus: ConnectionStatus;

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


function useAwaitedResponse(
    serverResponse: WsServerResponse | null,
    player: Player,
) : {
    awaitingResponse: boolean,
    addAwaitedResponse: () => WsRequestId,
 }
{
    const [ awaitedResponses, setAwaitedResponses ] = useState<WsRequestId[]>([]);
    const [ lastRequestNumber, setLastRequestNumber ] = useState(0);
    const [ playerId ] = useState(player.id);

    if(playerId !== player.id) {
        // Should never happen.
        console.error(`BUG: Player ID has changed: was ${playerId}, now ${player.id}.`);
    }

    const addAwaitedResponse = useCallback((): WsRequestId => {
        const requestNumber = lastRequestNumber + 1;
        setLastRequestNumber(requestNumber);

        const id: WsRequestId = { playerId: player.id, number: requestNumber }
        setAwaitedResponses(prev => [...prev, id]);
        return id;
    }, [lastRequestNumber, player.id]);

    const trigger = serverResponse?.trigger;
    const responseId = isWsClientRequest(trigger) ? trigger.id : null;

    useEffect(() => {
        if(responseId) {
            const newAwaitedResponses = awaitedResponses.filter(
                id => !(id.playerId === responseId.playerId && id.number === responseId.number)
            );
            if(newAwaitedResponses.length !== awaitedResponses.length) {
                setAwaitedResponses(newAwaitedResponses);
            }
        }
    }, [responseId, awaitedResponses]);
    
    return { awaitingResponse: awaitedResponses.length > 0, addAwaitedResponse };
}

export function useOnlineMatchData(
    appGame: AppGame,
    {matchID, player}: {matchID: MatchID, player: Player},
): OnlineMatchData {

    const { readyState, serverResponse, sendMatchRequest: rawSendRequest 
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
    return { connectionStatus, connectionError, serverMatchData: lastServerMatchData, moves, events };
}

