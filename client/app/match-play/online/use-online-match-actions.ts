import { AppGame, Player } from "@/app-game-support";
import { EventsAPI } from "@shared/game-control/events";
import { WsRequestId, WsRequestedAction, isWsClientRequest } from "@shared/ws-client-request";
import { UntypedMoves } from "@/app-game-support/board-props";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ServerConnection } from "./use-server-connection";
import { WaitingForServer } from "../game-board-wrapper";

function sameRequestID(a: WsRequestId, b: WsRequestId) {
    return a.playerId === b.playerId && a.number === b.number;
}

// Return actions - moves and events - suitable for an online game.
// Also return a flag to say whether the server has responded to the actions.
export function useOnlineMatchActions(
    appGame: AppGame,
    player: Player,

    // KLUDGE?: No account is taken of the connection status (e.g. whether the connection is open)
    { serverResponse, sendMatchRequest}: ServerConnection
): {
    moves: UntypedMoves;
    events: EventsAPI;
    waitingForServer: WaitingForServer;
} {
    const [awaitedResponses, setAwaitedResponses] = useState<WsRequestId[]>([]);
    const [ actionIgnored, setActionIgnored ] = useState(false);
    const lastRequestNumber = useRef(0);

    // Check if the server response is due to a client action rather than, say,  a connection warning.
    const responseId = isWsClientRequest(serverResponse?.trigger) ? serverResponse.trigger.id : null;

    useEffect(() => {
        if (responseId) {
            setAwaitedResponses(prev => {
                const stillAwaited = prev.filter(id => !sameRequestID(id, responseId));
                return stillAwaited.length !== prev.length ? stillAwaited : prev;
            });
        }
    }, [responseId]);

    const waitingForServerBoolean = awaitedResponses.length > 0;

    useEffect(() => {
        if ( !waitingForServerBoolean ) {
            setActionIgnored(false);
        }
    }, [waitingForServerBoolean]);

    const makeAction = useCallback((action: WsRequestedAction) => {
        if (waitingForServerBoolean) {
            setActionIgnored(true);
            return;
        }

        lastRequestNumber.current += 1;
        const id: WsRequestId = { playerId: player.id, number: lastRequestNumber.current };
        setAwaitedResponses(prev => [...prev, id]);

        sendMatchRequest({ id, action });
    }, [player.id, sendMatchRequest, waitingForServerBoolean]);

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
        waitingForServer: waitingForServerBoolean ? { actionIgnored } : false,
    }), [moves, events, waitingForServerBoolean, actionIgnored]);      
}
