import { ScrabbleConfig } from "../config";
import { GameState, isGameState, startingGameState } from "./game-state";

/** Data recorded and shared via BGIO */

export interface ServerData {
    state: GameState;

    /** Any move that changes game data will also increase timestamp */
    timestamp: number;

    serverError: string | null;
}
/** Quick check that an object is (probably) a GameData. */

export function isServerData(arg: unknown): boolean {
    const globalState = arg as ServerData;
    return isGameState(globalState.state) &&
        typeof globalState.timestamp === "number";
}

export function startingServerData(numPlayers: number, config: ScrabbleConfig): ServerData {

    return {
        state: startingGameState(numPlayers, config),

        timestamp: 0,
        serverError: null,
    };
}
