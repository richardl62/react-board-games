import { CtxData, isCtxData } from "./game-control/ctx.js";
import { PublicPlayerMetadata } from "./lobby/types.js";

// The infomation about a match that can be changed by a move or event.
export interface MutableMatchData {
    /** The context data (player order, etc.) for the match, changed by events 
     * also by moves that trigger events.
    */
    ctxData: CtxData;

    /** The current state of the game, changed by moves.*/
    state: unknown;
}

// All the information about a match that is available from the server.
export interface ServerMatchData extends MutableMatchData {
    /** The players who have joined the game */
    playerData: PublicPlayerMetadata[];
}

export function isServerMatchData(obj: unknown): obj is ServerMatchData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as ServerMatchData;

    return Array.isArray(candidate.playerData) &&
        isCtxData(candidate.ctxData);
}
