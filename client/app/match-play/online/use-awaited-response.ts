import { Player } from "@/app-game-support";
import { WsRequestId, isWsClientRequest } from "@shared/ws-client-request";
import { WsServerResponse } from "@shared/ws-server-response";
import { useState, useCallback, useEffect, useRef } from "react";

export function useAwaitedResponse(
    serverResponse: WsServerResponse | null,
    player: Player
): {
    awaitingResponse: boolean;
    addAwaitedResponse: () => WsRequestId;
} {
    const [awaitedResponses, setAwaitedResponses] = useState<WsRequestId[]>([]);
    const lastRequestNumber = useRef(0);

    const addAwaitedResponse = useCallback((): WsRequestId => {
        lastRequestNumber.current += 1;
        const requestNumber = lastRequestNumber.current;

        const id: WsRequestId = { playerId: player.id, number: requestNumber };
        setAwaitedResponses(prev => [...prev, id]);
        return id;
    }, [player.id]);

    const trigger = serverResponse?.trigger;
    const responseId = isWsClientRequest(trigger) ? trigger.id : null;

    useEffect(() => {
        if (responseId) {
            // Use a functional update to avoid a dependency on `awaitedResponses`.
            setAwaitedResponses(currentAwaitedResponses =>
                currentAwaitedResponses.filter(
                    id => !(id.playerId === responseId.playerId && id.number === responseId.number)
                )
            );
        }
    }, [responseId]);

    return { awaitingResponse: awaitedResponses.length > 0, addAwaitedResponse };
}
