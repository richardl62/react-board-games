import { MatchID } from "@/app-game-support";
import { WsServerResponse } from "@shared/ws-server-response";
import { useEffect, useState } from "react";

export function useLastServerResponse(matchID: MatchID, currentServerResponse: WsServerResponse | null) {
    const [lastServerResponse, setLastServerResponse] = useState<WsServerResponse | null>(null);

    // Reset the cached response if the match ID changes (not sure if this is necessary). 
    useEffect(() => {
        setLastServerResponse(null);
    }, [matchID]);

    // Cache the last non-null server response.
    useEffect(() => {
        if (currentServerResponse !== null) {
            setLastServerResponse(currentServerResponse);
        }
    }, [currentServerResponse]);

    return lastServerResponse;
}