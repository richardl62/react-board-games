import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";
import { GameControl } from "../../app-game-support/app-game";

export const appGameNoBoard: GameControl = {
    name: "5000",

    setup: startingServerData as GameControl["setup"],
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
