import { ServerMatchData, isServerMatchData } from "./server-match-data.js";
import { WsResponseTrigger, isWsResponseTrigger } from "./ws-response-trigger.js";

export interface WsServerResponse {
    trigger: WsResponseTrigger;

    // At least one of matchData or error should be non-null.
    matchData: ServerMatchData | null;
    error: string | null;
}

export function isWsServerResponse(obj: unknown): obj is WsServerResponse {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsServerResponse;

    const matchDataOK = candidate.matchData === null || isServerMatchData(candidate.matchData);
    const errorOK = candidate.error === null || typeof candidate.error === "string";
    
    return isWsResponseTrigger(candidate.trigger) && matchDataOK && errorOK &&
        Boolean(candidate.matchData || candidate.error);
}

