import { GameControl } from "../../app-game-support/app-game";
import { bgioMoves } from "./game-control/moves";
import { startingServerData } from "./game-control/starting-server-data";

export const appGameNoBoard: GameControl = {
    name: "acesup",
    setup: startingServerData as GameControl["setup"],

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
