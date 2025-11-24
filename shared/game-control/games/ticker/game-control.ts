import { startingServerData } from "./server-data.js";
import { moves } from "./moves/moves.js";
import { GameControl } from "../../game-control.js";

export const gameControl: GameControl = {
    name: "ticker",
    setup: startingServerData, 

    minPlayers: 1,
    maxPlayers: 8,

    moves,
};
