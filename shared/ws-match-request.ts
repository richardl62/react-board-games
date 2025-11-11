// Data sent over a WebSocket to request an action related to a match.
// The action can be a move or an event.
export interface WsMatchRequest {
    move: string;
    arg: unknown;
}

export function isWsMatchRequest(obj: unknown): obj is WsMatchRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as Record<string, unknown>;

    if (typeof candidate.move !== "string") {
        return false;
    }

    if (!Object.keys(candidate).includes("arg")) {
        return false;
    }

    return true;
}
