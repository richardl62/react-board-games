import { AllActive, GameControl } from "../../game-control.js";
import { moves } from "./moves/moves.js";
import { startingServerData } from "./server-data.js";

export const gameControl: GameControl = {
    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,


    setup: startingServerData,

    moves,
    
    // Turn order is not enforced.
    turnOrder: AllActive,
};