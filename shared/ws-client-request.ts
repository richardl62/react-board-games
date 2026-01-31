// Data sent by a client to request a server action.
// The action can be make move or end the turn.

import { isWsRequestedAction, WsRequestedAction } from "./ws-requested-action.js";

// Included in all requests
export interface WsRequestId {
    playerId: string;
    number: number;
}

// Represents a request sent over WebSocket to perform an action on a match,
// which can either be ending the turn or making a move.
export type WsClientRequest = {
    id: WsRequestId;
    action: WsRequestedAction;
}

export function isWsRequestId(obj: unknown): obj is WsRequestId {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsRequestId;
    return typeof candidate.playerId === "string" && 
        typeof candidate.number === "number";
}

export function isWsClientRequest(obj: unknown): obj is WsClientRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsClientRequest;
    return isWsRequestId(candidate.id) && isWsRequestedAction(candidate.action);
}

