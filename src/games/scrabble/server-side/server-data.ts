import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { ScrabbleConfig } from "../config";
import { GameState, isGameState, startingGameState } from "./game-state";

/** Data recorded and shared via BGIO */

export interface ServerData extends RequiredServerData {
    /** states avialable for undo/redo */
    states: GameState[];
}
/** Quick check that an object is (probably) a GameData. */

export function isServerData(arg: unknown): boolean {
    const serverData = arg as ServerData;
    return Array.isArray(serverData.states) &&
        typeof serverData.moveCount === "number" &&
        isGameState(serverData.states[0]);
}

export function startingServerData({ctx}: {ctx: Ctx}, config: ScrabbleConfig): ServerData {

    return {
        states: [startingGameState(ctx, config)],
        ...startingRequiredState(),
    };
}
