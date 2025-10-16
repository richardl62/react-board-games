import { GameControl } from "@game-control/game-control";
import { bgioMoves } from "./moves";
import { startingServerData } from "./server-data";

export const gameControl: GameControl = {
    name: "plusminus",

    setup: startingServerData as GameControl["setup"],
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
