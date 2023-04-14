import { GameCategory } from "../../app-game-support";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { bgioMoves } from "./game-control/moves";
import { startingServerData } from "./game-control/starting-server-data";
import { setupOptions } from "./game-support/setup-options";

export const appGameNoBoard: AppGameNoBoard = {
    name: "acesup",
    displayName: "Aces Up",
    category: GameCategory.standard,

    options: setupOptions,
    setup: startingServerData as AppGameNoBoard["setup"],

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
