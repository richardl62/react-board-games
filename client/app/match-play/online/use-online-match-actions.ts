import { AppGame, Player } from "@/app-game-support";
import { EventsAPI } from "@shared/game-control/events";
import { WsRequestId, isWsClientRequest } from "@shared/ws-client-request";
import { WsRequestedAction } from "@shared/ws-requested-action";
import { UntypedMoves } from "@/app-game-support/board-props";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ServerConnection } from "./use-server-connection";
import { ActionRequestStatus } from "../game-board-wrapper";
import { isWsClientConnection } from "@shared/ws-response-trigger";
import { ServerMatchData } from "@shared/server-match-data";
import { applyActionLocally } from "../apply-action-locally";

function sameRequestID(a: WsRequestId, b: WsRequestId) {
    return a.playerId === b.playerId && a.number === b.number;
}

// Return actions - moves and events - suitable for an online game.
// Also return status information about the action requested, and an
// optimistic match state (applied locally before the server responds).
export function useOnlineMatchActions(
    appGame: AppGame,
    player: Player,
    { serverResponse, sendMatchRequest, flushedQueueOnReconnect }: ServerConnection,
    matchData: ServerMatchData,
): {
    moves: UntypedMoves;
    events: EventsAPI;
    actionRequestStatus: ActionRequestStatus;
    optimisticMatchData: ServerMatchData | null;
} {
    const [awaitedResponses, setAwaitedResponses] = useState<WsRequestId[]>([]);
    const [lastActionIgnored, setLastActionIgnored] = useState(false);
    const [optimisticMatchData, setOptimisticMatchData] = useState<ServerMatchData | null>(null);

    const lastRequestNumber = useRef(0);

    // Read matchData synchronously in makeAction without it being a useCallback dependency
    // (matchData changes on every server response; listing it as a dep would recreate moves/events
    // on every response and cause unnecessary re-renders). Mirrors the waitingForServerRef pattern.
    const matchDataRef = useRef(matchData);
    matchDataRef.current = matchData;

    // Check if the server response is due to a client action rather than, say, a connection warning.
    const trigger = serverResponse?.trigger;
    const responseId = isWsClientRequest(trigger) ? trigger.id : null;

    useEffect(() => {
        if (responseId) {
            setAwaitedResponses(prev => {
                const stillAwaited = prev.filter(id => !sameRequestID(id, responseId));
                return stillAwaited.length !== prev.length ? stillAwaited : prev;
            });
            setOptimisticMatchData(null);
        }
    }, [responseId]);

    // On reconnection the server sends a wsClientConnection trigger with the authoritative
    // current state. If the queue was empty at reconnect, any in-flight response is lost —
    // clear everything so the player can act again. If messages were flushed from the queue,
    // the server is about to process them and will respond normally, so leave the in-flight
    // state intact.
    useEffect(() => {
        if (serverResponse && isWsClientConnection(serverResponse.trigger)) {
            if (!flushedQueueOnReconnect.current) {
                setAwaitedResponses([]);
                setOptimisticMatchData(null);
            }
        }
    }, [serverResponse, flushedQueueOnReconnect]);

    // Storing the waiting status in a ref as well as a 'direct' variable. The ref allows
    // for the (probably rare) case where a user triggers an action twice before the state
    // updates. The variable is for use in dependencies in later hooks (linters do not like
    // the use of waitingForServerRef.current as a dependency).
    const waitingForServer = awaitedResponses.length > 0;
    const waitingForServerRef = useRef(waitingForServer);
    waitingForServerRef.current = waitingForServer;

    const makeAction = useCallback((action: WsRequestedAction) => {
        // Don't attempt an action if waiting for a response to a prior action.
        // If disconnected, the action is allowed and will be queued by the connection hook.
        const ignoreAction = waitingForServerRef.current;
        setLastActionIgnored(ignoreAction);
        if (ignoreAction) return;

        // Apply the move locally for immediate display, using the same PRNG state the server
        // will use. If local validation fails (shouldn't happen with a correct UI), abort.
        try {
            setOptimisticMatchData(applyActionLocally(appGame, action, player.id, matchDataRef.current));
        } catch (_e) {
            setLastActionIgnored(true);
            return;
        }

        lastRequestNumber.current += 1;
        const id: WsRequestId = { playerId: player.id, number: lastRequestNumber.current };
        setAwaitedResponses(prev => [...prev, id]);
        waitingForServerRef.current = true;

        sendMatchRequest({ id, action });
    }, [appGame, player.id, sendMatchRequest]);

    const { moves, events } = useMemo(() => {
        const moves: UntypedMoves = {};
        for (const moveName of Object.keys(appGame.moves)) {
            moves[moveName] = (arg) => makeAction({ move: moveName, arg });
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
        actionRequestStatus: { waitingForServer, lastActionIgnored },
        optimisticMatchData,
    }), [moves, events, waitingForServer, lastActionIgnored, optimisticMatchData]);
}
