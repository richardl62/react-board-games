import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { GameControl } from "@/game-controlX/game-control";

export const appGameNoBoard: GameControl = {
    name: "ticker",
    setup: startingServerData, 

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
