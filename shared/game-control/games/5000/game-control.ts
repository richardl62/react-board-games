import { moves } from "./moves/moves.js";
import { startingServerData } from "./server-data.js";
import { GameControl } from "../../game-control.js";

export const gameControl: GameControl = {
    name: "5000",

    setup: startingServerData,
    
    minPlayers: 1,
    maxPlayers: 8,

    moves,
};
