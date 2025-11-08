import { PublicPlayerMetadata } from "./lobby/types.js";

export interface ServerMatchData<GameState = unknown> {
    /** The players who have joined the game */
    playerData: PublicPlayerMetadata[];

    /** The play whose turn it is. */
    currentPlayer: number;

    /** The current state of the game, changed using moves. */
    state: GameState;
}

// The info returned from the server after a move.
// Also returned after a connection.
export type ServerMoveResponse = {
    /** Error typically related to the previous move, but could show other bugs.
     */
    error: string | null;

    /** Match data will be missing following certain errors */
    matchData: ServerMatchData | null; 
};

// The info sent to the server when requesting a move.
export interface ServerMoveRequest {
    move: string;
    arg: unknown;
}

export function isServerMoveRequest(obj: unknown): obj is ServerMoveRequest {
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
