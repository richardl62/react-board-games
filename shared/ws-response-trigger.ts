import { WsClientRequest, isWsClientRequest } from "./ws-client-request";

// Set to all players in a match when a client connects or disconnects.
export interface WsClientConnection { clientConnection: true };

export type WsResponseTrigger = WsClientRequest | WsClientConnection;

export function isWsClientConnection(obj: unknown): obj is WsClientConnection {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsClientConnection;
    return candidate.clientConnection === true;
}

export function isWsResponseTrigger(obj: unknown): obj is WsResponseTrigger {
    return isWsClientRequest(obj) || isWsClientConnection(obj);
}