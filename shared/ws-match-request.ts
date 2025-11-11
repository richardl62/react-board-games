// Data sent over a WebSocket to request an action on a match.
// The action can be a move or ending the turn.

export interface WsMoveRequest {
    move: string;
    arg: unknown;
}

export const WsEndTurn = "endTurn";
export type WsMatchRequest = typeof WsEndTurn | WsMoveRequest;

export function isWsMoveRequest(obj: unknown): obj is WsMoveRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as Record<string, unknown>;

    if (typeof candidate.move !== "string") {
        return false;
    }

    if (!("arg" in candidate)) {
        return false;
    }

    return true;
}

export function isWsMatchRequest(obj: unknown): obj is WsMatchRequest {
    return obj === WsEndTurn || isWsMoveRequest(obj);
}

