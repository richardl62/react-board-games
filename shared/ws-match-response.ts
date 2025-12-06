import { CtxData, isCtxData } from "./game-control/ctx.js";
import { isRequiredServerData, RequiredServerData } from "./game-control/required-server-data.js";
import { PublicPlayerMetadata } from "./lobby/types.js";

// Info about a match that is available from the server.
export interface ServerMatchData {
    /** The players who have joined the game */
    playerData: PublicPlayerMetadata[];

    ctxData: CtxData

    /** The current state of the game, changed using moves. 
     * KLUDGE?: Will include more than just RequiredServerData.
    */
    state: RequiredServerData;
}

export function isServerMatchData(obj: unknown): obj is ServerMatchData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as ServerMatchData;

    return Array.isArray(candidate.playerData) &&
        isCtxData(candidate.ctxData) &&
        isRequiredServerData(candidate.state);
}

// The info about a match returned from the server over a WebSocket.
// This is sent after an initial connection, a move or an event.
export type WsMatchResponse = {
    /** Error typically related to the previous move, but could show other bugs.
     */
    error: string | null;

    /** Match data will be missing following certain errors */
    matchData: ServerMatchData | null; 
};

export function isWsMatchResponse(obj: unknown): obj is WsMatchResponse {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as WsMatchResponse;

    return (candidate.error === null || typeof candidate.error === "string") &&
           (candidate.matchData === null || isServerMatchData(candidate.matchData));
}   