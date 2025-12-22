import { Player } from "@/app-game-support";
import { WsRequestId, isWsClientRequest } from "@shared/ws-client-request";
import { WsServerResponse } from "@shared/ws-server-response";
import { useState, useCallback, useEffect } from "react";

export function useAwaitedResponse(
    serverResponse: WsServerResponse | null,
    player: Player
): {
    awaitingResponse: boolean;
    addAwaitedResponse: () => WsRequestId;
} {
    const [awaitedResponses, setAwaitedResponses] = useState<WsRequestId[]>([]);
    const [lastRequestNumber, setLastRequestNumber] = useState(0);
    const [playerId] = useState(player.id);

    if (playerId !== player.id) {
        // Should never happen.
        console.error(`BUG: Player ID has changed: was ${playerId}, now ${player.id}.`);
    }

    const addAwaitedResponse = useCallback((): WsRequestId => {
        const requestNumber = lastRequestNumber + 1;
        setLastRequestNumber(requestNumber);

        const id: WsRequestId = { playerId: player.id, number: requestNumber };
        setAwaitedResponses(prev => [...prev, id]);
        return id;
    }, [lastRequestNumber, player.id]);

    const trigger = serverResponse?.trigger;
    const responseId = isWsClientRequest(trigger) ? trigger.id : null;

    useEffect(() => {
        if (responseId) {
            const newAwaitedResponses = awaitedResponses.filter(
                id => !(id.playerId === responseId.playerId && id.number === responseId.number)
            );
            if (newAwaitedResponses.length !== awaitedResponses.length) {
                setAwaitedResponses(newAwaitedResponses);
            }
        }
    }, [responseId, awaitedResponses]);

    return { awaitingResponse: awaitedResponses.length > 0, addAwaitedResponse };
}
