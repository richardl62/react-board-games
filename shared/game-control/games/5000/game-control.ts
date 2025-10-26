import { bgioMoves } from "./moves/moves.js";
import { startingServerData } from "./server-data.js";
import { GameControl } from "../../game-control.js";

export const appGameNoBoard: GameControl = {
    name: "5000",

    setup: startingServerData,
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
