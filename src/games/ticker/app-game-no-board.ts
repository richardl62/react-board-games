import { GameCategory } from "../../app-game-support";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { AppGameNoBoard } from "../../app-game-support/app-game";

export const appGameNoBoard: AppGameNoBoard = {
    name: "ticker",
    displayName: "Ticker",
    category: GameCategory.test,

    setup: startingServerData, 

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
