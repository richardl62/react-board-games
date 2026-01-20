import { ServerMatchData, isServerMatchData } from "./server-match-data.js";
import { WsResponseTrigger, isWsResponseTrigger } from "./ws-response-trigger.js";

export interface WsServerResponse {
    trigger: WsResponseTrigger;

    matchData: ServerMatchData;

    /** An error reported by the last action (i.e. move or event), or null if there was no
     * reported error. */
    errorInLastAction: string | null;
}

export function isWsServerResponse(obj: unknown): obj is WsServerResponse {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsServerResponse;

    return isWsResponseTrigger(candidate.trigger) &&
        isServerMatchData(candidate.matchData);
}
