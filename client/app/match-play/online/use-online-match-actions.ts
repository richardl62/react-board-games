import { AppGame, Player } from "@/app-game-support";
import { EventsAPI } from "@shared/game-control/events";
import { WsRequestId, isWsClientRequest } from "@shared/ws-client-request";
import { WsRequestedAction } from "@shared/ws-requested-action";
import { UntypedMoves } from "@/app-game-support/board-props";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ServerConnection } from "./use-server-connection";
import { ActionRequestStatus } from "../game-board-wrapper";

function sameRequestID(a: WsRequestId, b: WsRequestId) {
    return a.playerId === b.playerId && a.number === b.number;
}

// Return actions - moves and events - suitable for an online game.
// Also return status information about the action requested.
export function useOnlineMatchActions(
    appGame: AppGame,
    player: Player,
    { serverResponse, sendMatchRequest, connectionStatus}: ServerConnection
): {
    moves: UntypedMoves;
    events: EventsAPI;
    actionRequestStatus: ActionRequestStatus;
} {
    const [awaitedResponses, setAwaitedResponses] = useState<WsRequestId[]>([]);
    const [ lastActionIgnored, setLastActionIgnored ] = useState(false);
    
    const lastRequestNumber = useRef(0);

    // Check if the server response is due to a client action rather than, say,  a connection warning.
    const trigger = serverResponse?.trigger;
    const responseId = isWsClientRequest(trigger) ? trigger.id : null;

    useEffect(() => {
        if (responseId) {
            setAwaitedResponses(prev => {
                const stillAwaited = prev.filter(id => !sameRequestID(id, responseId));
                return stillAwaited.length !== prev.length ? stillAwaited : prev;
            });
        }
    }, [responseId]);

    // Storing the waiting status in a ref as well a 'direct' variable. The ref allows
    // for the (probably rare) case where a user triggers an action twice before the state 
    // updates. The variable is for use in dependencies in later hooks (linters do not like
    // the use of waitingForServerRef.current as a dependency).
    const waitingForServer = awaitedResponses.length > 0;
    const waitingForServerRef = useRef(waitingForServer);
    waitingForServerRef.current = waitingForServer;

    const makeAction = useCallback((action: WsRequestedAction) => {
        // Don't attempt an action if disconnected or if waiting for a response to
        // a prior action.
        const ignoreAction = connectionStatus !== 'connected' || waitingForServerRef.current;
        setLastActionIgnored(ignoreAction);
        
        if (ignoreAction) {
            return;
        }

        lastRequestNumber.current += 1;
        const id: WsRequestId = { playerId: player.id, number: lastRequestNumber.current };
        setAwaitedResponses(prev => [...prev, id]);
        waitingForServerRef.current = true;
        
        sendMatchRequest({ id, action });
    }, [player.id, sendMatchRequest, connectionStatus]);

    const {moves, events } = useMemo(() => {
        const moves: UntypedMoves = {};
        for (const moveName of Object.keys(appGame.moves)) {
            moves[moveName] = (arg) => makeAction({move: moveName, arg});
        }

        const events: EventsAPI = {
            endTurn: () => makeAction({ endTurn: true }),
            endMatch: () => makeAction({ endMatch: true }),
        };

        return { moves, events };
    }, [appGame.moves, makeAction]);

    return useMemo(() => ({
        moves,
        events,
        actionRequestStatus: {waitingForServer, lastActionIgnored },
    }), [moves, events, waitingForServer, lastActionIgnored]);      
}
