import { CtxData, isCtxData } from "./game-control/ctx.js";
import { PublicPlayerMetadata } from "./lobby/types.js";

// Info about a match that is available from the server.
export interface ServerMatchData {
    /** The players who have joined the game */
    playerData: PublicPlayerMetadata[];

    ctxData: CtxData;

    /** The current state of the game, changed using moves and events. */
    state: unknown;

    moveError: string | null;
}

export function isServerMatchData(obj: unknown): obj is ServerMatchData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as ServerMatchData;

    return Array.isArray(candidate.playerData) &&
        isCtxData(candidate.ctxData) &&
        (typeof candidate.moveError === "string" || candidate.moveError === null);
}
