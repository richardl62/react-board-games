import { ServerMatchData, isServerMatchData } from "./server-match-data.js";
import { WsResponseTrigger, isWsResponseTrigger } from "./ws-response-trigger.js";

export interface WsServerResponseSuccess {
    trigger: WsResponseTrigger;

    matchData: ServerMatchData;

    connectionError?: undefined;
}

export interface WsServerResponseError {
    trigger: WsResponseTrigger;

    // At least one of matchData or error should be non-null.
    matchData?: undefined;

    // A problem that prevented a connection from being established, 
    // such as an unregonised ID or invalid credentials.
    connectionError: string;
}

export type WsServerResponse = WsServerResponseSuccess | WsServerResponseError;

export function isWsServerResponse(obj: unknown): obj is WsServerResponse {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsServerResponse;

    if (!isWsResponseTrigger(candidate.trigger))
        return false;

    const matchDataOK = isServerMatchData(candidate.matchData);
    const errorOK = typeof candidate.connectionError === "string";
    
    return Boolean(matchDataOK || errorOK);
}

