import { ScrabbleConfig } from "../config";
import { GameState, isGameState, startingGameState } from "./game-state";

/** Data recorded and shared via BGIO */

export interface ServerData {
    /** states avialable for undo/redo */
    states: GameState[];

    /** Any move that changes game data will also increase timestamp */
    timestamp: number;

    serverError: string | null;
}
/** Quick check that an object is (probably) a GameData. */

export function isServerData(arg: unknown): boolean {
    const serverData = arg as ServerData;
    return Array.isArray(serverData.states) &&
        typeof serverData.timestamp === "number" &&
        isGameState(serverData.states[0]);
}

export function startingServerData(numPlayers: number, config: ScrabbleConfig): ServerData {

    return {
        states: [startingGameState(numPlayers, config)],
        timestamp: 0,
        serverError: null,
    };
}
