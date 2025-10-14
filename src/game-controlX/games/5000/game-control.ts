import { bgioMoves } from "./moves/moves";
import { startingServerData } from "./server-data";
import { GameControl } from "@/game-controlX/game-control";

export const appGameNoBoard: GameControl = {
    name: "5000",

    setup: startingServerData as GameControl["setup"],
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
