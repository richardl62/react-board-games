// Data sent by a client to request a server action.
// The action can be make move or end the turn.

// Included in all requests
export interface WsRequestId {
    playerId: string;
    number: number;
}

export interface WsMoveRequest {
    id: WsRequestId;
    move: string;
    arg: unknown;
}

export interface WsEndTurn {
    id: WsRequestId;
    endTurn: true;
}

export interface WsEndMatch {
    id: WsRequestId;
    endMatch: true;
}

// Represents a request sent over WebSocket to perform an action on a match,
// which can either be ending the turn or making a move.
export type WsClientRequest = WsEndTurn | WsEndMatch | WsMoveRequest;

export function isWsRequestId(obj: unknown): obj is WsRequestId {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsRequestId;
    return typeof candidate.playerId === "string" && 
        typeof candidate.number === "number";
}

export function isWsMoveRequest(obj: unknown): obj is WsMoveRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsMoveRequest;

    // There does not seem to be any way to for 'arg'.  Even checking
    // "'arg' in candidate" goes wrong for functions that don't take arguments. 
    return isWsRequestId(candidate.id) &&
        typeof candidate.move === "string" /*&& 
        'arg' in candidate*/;
}

export function isWsEndTurn(obj: unknown): obj is  WsEndTurn {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsEndTurn;
    return isWsRequestId(candidate.id) && 
        candidate.endTurn === true;
}

export function isWsEndMatch(obj: unknown): obj is WsEndMatch {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsEndMatch;
    return isWsRequestId(candidate.id) &&
        candidate.endMatch === true;
}

export function isWsClientRequest(obj: unknown): obj is WsClientRequest {
    return isWsEndTurn(obj) || isWsEndMatch(obj)  || isWsMoveRequest(obj);
}

