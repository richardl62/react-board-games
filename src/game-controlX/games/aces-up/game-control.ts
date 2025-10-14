import { GameControl } from "@/game-controlX/game-control";
import { bgioMoves } from "./game-control/moves";
import { startingServerData } from "./game-control/starting-server-data";

export const appGameNoBoard: GameControl = {
    name: "acesup",
    setup: startingServerData as GameControl["setup"],

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,
};
