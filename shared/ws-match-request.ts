// Data sent over a WebSocket to request an action on a match.
// The action can be a move or ending the turn.

export interface WsMoveRequest {
    move: string;
    arg: unknown;
}

export interface WsEndTurn {
    endTurn: true;
}

// Represents a request sent over WebSocket to perform an action on a match,
// which can either be ending the turn or making a move.
export type WsMatchRequest = WsEndTurn | WsMoveRequest;

// Only a basic check as it is hard to know how to check 'arg'.
export function isWsMoveRequest(obj: unknown): obj is WsMoveRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as Record<string, unknown>;

    return typeof candidate.move === "string";
}

export function isWsEndTurn(obj: unknown): obj is WsEndTurn {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as Record<string, unknown>;

    return candidate.endTurn === true;
}

export function isWsMatchRequest(obj: unknown): obj is WsMatchRequest {
    return isWsEndTurn(obj) || isWsMoveRequest(obj);
}

