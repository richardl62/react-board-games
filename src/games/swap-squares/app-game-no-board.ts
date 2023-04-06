import { AppGame, GameCategory } from "../../app-game-support";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { setupOptions } from "./options";
import { AppGameNoBoard } from "../../app-game-support/app-game";

export const appGameNoBoard: AppGameNoBoard = {
    name: "swapsquares",
    displayName: "Swap Squares",
    category: GameCategory.test,

    options: setupOptions,
    setup: startingServerData as AppGame["setup"],

    minPlayers: 1,
    maxPlayers: 1,

    moves: bgioMoves,
};
