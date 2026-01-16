import { WsClientRequest, isWsClientRequest } from "./ws-client-request.js";

// Used when players in a match connect or disconnect.
export const wsClientConnection = { clientConnection: true } as const;

export const wsBadClientRequest = { badClientRequest: true } as const;

export const wsUnknownProblem = { unknownProblem: true } as const;

export type WsResponseTrigger = WsClientRequest | typeof wsBadClientRequest | typeof wsClientConnection | 
    typeof wsUnknownProblem;

export function isWsClientConnection(obj: unknown): obj is typeof wsClientConnection {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as typeof wsClientConnection;
    return candidate.clientConnection === true;
}

export function isWsBadClientRequest(obj: unknown): obj is typeof wsBadClientRequest {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as typeof wsBadClientRequest;
    return candidate.badClientRequest === true;
}

export function isWsUnknownProblem(obj: unknown): obj is typeof wsUnknownProblem {
    if (typeof obj !== "object" || obj === null)
        return false;       
    const candidate = obj as typeof wsUnknownProblem;
    return candidate.unknownProblem === true;
}

export function isWsResponseTrigger(obj: unknown): obj is WsResponseTrigger {
    return isWsClientRequest(obj) || isWsClientConnection(obj) || isWsBadClientRequest(obj)
        || isWsUnknownProblem(obj);
}