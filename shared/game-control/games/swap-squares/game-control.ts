import { startingServerData } from "./server-data.js";
import { bgioMoves } from "./moves/moves.js";
import { GameControl } from "../../game-control.js";

export const appGameNoBoard: GameControl = {
    name: "swapsquares",

    setup: startingServerData,

    minPlayers: 1,
    maxPlayers: 1,

    moves: bgioMoves,
};
