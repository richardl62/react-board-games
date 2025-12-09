import { ServerMatchData, isServerMatchData } from "./server-match-data.js";
import { isWsClientRequest, WsClientRequest } from "./ws-client-request.js";

// Set to all players in a match when a client connects or disconnects.
export interface WsClientConnection { clientConnection: true };

export type WsResponseTrigger = WsClientRequest | WsClientConnection;

export interface WsServerResponse {
    trigger: WsResponseTrigger;

    // At least one of matchData or error should be non-null.
    matchData: ServerMatchData | null;
    error: string | null;
}

export function isWsClientConnection(obj: unknown): obj is WsClientConnection {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsClientConnection;
    return candidate.clientConnection === true;
} 

function isWsResponseTrigger(obj: unknown): obj is WsResponseTrigger {
    return isWsClientRequest(obj) || isWsClientConnection(obj);
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

