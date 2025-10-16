import { ActivePlayers, GameControl } from "@/game-controlX/game-control";
import { bgioMoves } from "./moves/moves";
import { startingServerData } from "./server-data";

export const appGameNoBoard: GameControl = {
    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,


    setup: startingServerData as GameControl["setup"],

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },
};