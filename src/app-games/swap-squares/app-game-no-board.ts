import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { GameControl } from "@/game-controlX/game-control";

export const appGameNoBoard: GameControl = {
    name: "swapsquares",

    setup: startingServerData as GameControl["setup"],

    minPlayers: 1,
    maxPlayers: 1,

    moves: bgioMoves,
};
