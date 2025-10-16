import { startingServerData } from "./server-data";
import { bgioMoves } from "./moves/moves";
import { GameControl } from "@game-control/game-control";

export const appGameNoBoard: GameControl = {
    name: "ticker",
    setup: startingServerData, 

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
