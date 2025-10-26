import { ActivePlayers, GameControl } from "../../game-control.js";
import { bgioMoves } from "./moves/moves.js";
import { startingServerData } from "./server-data.js";

export const appGameNoBoard: GameControl = {
    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,


    setup: startingServerData,

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },
};