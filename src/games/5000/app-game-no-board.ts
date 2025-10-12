import { GameCategory } from "../../app-game-support";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";
import { GameControl } from "../../app-game-support/app-game";

export const appGameNoBoard: GameControl = {
    name: "5000",
    displayName: "5000",
    category: GameCategory.standard,

    setup: startingServerData as GameControl["setup"],
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
