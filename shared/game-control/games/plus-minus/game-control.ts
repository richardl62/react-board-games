import { GameControl } from "../../game-control.js";
import { bgioMoves } from "./moves.js";
import { startingServerData } from "./server-data.js";

export const gameControl: GameControl = {
    name: "plusminus",

    setup: startingServerData,
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
