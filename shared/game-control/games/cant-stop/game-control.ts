import { GameControl } from "../../game-control.js";
import { moves } from "./moves/moves.js";
import { startingServerData } from "./server-data.js";

export const gameControl: GameControl = {
    name: "cantstop",

    setup: startingServerData,
    
    minPlayers: 1,
    maxPlayers: 4,

    moves,
};
