import { GameCategory } from "../../app-game-support";
import { GameControl } from "../../app-game-support/app-game";
import { bgioMoves } from "./game-control/moves";
import { startingServerData } from "./game-control/starting-server-data";

export const appGameNoBoard: GameControl = {
    name: "acesup",
    displayName: "Aces Up",
    category: GameCategory.standard,

    setup: startingServerData as GameControl["setup"],

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
