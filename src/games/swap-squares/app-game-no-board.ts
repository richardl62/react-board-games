import { AppGame, GameCategory } from "../../app-game-support";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { GameControl } from "../../app-game-support/app-game";

export const appGameNoBoard: GameControl = {
    name: "swapsquares",
    displayName: "Swap Squares",
    category: GameCategory.test,

    setup: startingServerData as AppGame["setup"],

    minPlayers: 1,
    maxPlayers: 1,

    moves: bgioMoves,
};
