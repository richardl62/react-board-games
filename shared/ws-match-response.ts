import { PublicPlayerMetadata } from "./lobby/types.js";

// Info about a match that is available from the server.
export interface ServerMatchData<GameState = unknown> {
    /** The players who have joined the game */
    playerData: PublicPlayerMetadata[];

    /** The play whose turn it is. */
    currentPlayer: number;

    /** The current state of the game, changed using moves. */
    state: GameState;
}

// The info about a match returned from the server over a WebSocket.
// This is send after an initial connection, a move or an event.
export type WsMatchResponse = {
    /** Error typically related to the previous move, but could show other bugs.
     */
    error: string | null;

    /** Match data will be missing following certain errors */
    matchData: ServerMatchData | null; 
};


