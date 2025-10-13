import { ActivePlayers } from "@/game-controlX/game";
import { GameControl } from "../../app-game-support/app-game";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";

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