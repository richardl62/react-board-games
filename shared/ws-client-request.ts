// Data sent by a client to request a server action.
// The action can be make move or end the turn.

// Included in all requests
export interface WsRequestId {
    playerId: string;
    number: number;
}

export interface WsMove {
    move: string;
    arg: unknown;
}

export interface WsEndTurn {
    endTurn: true;
}

export interface WsEndMatch {
    endMatch: true;
}

export type WsRequestedAction = WsEndTurn | WsEndMatch | WsMove;

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

export function isWsMove(obj: unknown): obj is WsMove {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsMove;
    // There does not seem to be any way to for 'arg'.  Even checking
    // "'arg' in candidate" goes wrong for functions that don't take arguments. 
    return  typeof candidate.move === "string" /*&& 
        'arg' in candidate*/;
}

export function isWsEndTurn(obj: unknown): obj is  WsEndTurn {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsEndTurn;
    return candidate.endTurn === true;
}

export function isWsEndMatch(obj: unknown): obj is WsEndMatch {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsEndMatch;
    return candidate.endMatch === true;
}

export function isWsRequestedAction(obj: unknown): obj is WsRequestedAction {
    return isWsEndTurn(obj) || isWsEndMatch(obj) || isWsMove(obj);
}

export function isWsClientRequest(obj: unknown): obj is WsClientRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsClientRequest;
    return isWsRequestId(candidate.id) && isWsRequestedAction(candidate.action);
}

