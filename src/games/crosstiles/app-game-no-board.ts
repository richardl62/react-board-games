import { ActivePlayers } from "../../boardgame-lib/game";
import { GameCategory } from "../../app-game-support";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { setupOptions } from "./options";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";


export const appGameNoBoard: AppGameNoBoard = {

    displayName: "CrossTiles",
    category: GameCategory.standard,

    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,

    options: setupOptions,
    setup: startingServerData as AppGameNoBoard["setup"],

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },
};