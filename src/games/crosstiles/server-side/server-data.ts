import { Letter } from "../config";
import { selectTiles } from "./select-tiles";

export interface GameState {
    selectedLetters: Letter[];
}

function startingGameState() : GameState {
    return {
        selectedLetters: selectTiles(),
    };
}

export interface ServerData extends GameState {
    serverError: string | null;
    timestamp: number;
}

export function startingServerData(): ServerData {
    return {
        ...startingGameState(),

        serverError: null,
        timestamp: 0,
    };
}

/** Sanity check only */
export function isServerData(sd: ServerData) : boolean {
    const { selectedLetters, serverError, timestamp} = sd;
    return Array.isArray(selectedLetters) &&
        (serverError === null || typeof serverError === "string") &&
        typeof timestamp === "number";
}