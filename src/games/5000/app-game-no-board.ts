import { GameCategory } from "../../app-game-support";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { setupOptions } from "./options";

export const appGameNoBoard: AppGameNoBoard = {
    name: "5000",
    displayName: "5000",
    category: GameCategory.standard,

    options: setupOptions,
    setup: startingServerData as AppGameNoBoard["setup"],
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
