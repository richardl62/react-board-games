import { GameControl } from "@/game-controlX/game-control";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";

export const appGameNoBoard: GameControl = {
    name: "plusminus",

    setup: startingServerData as GameControl["setup"],
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
