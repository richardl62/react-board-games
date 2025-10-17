import { GameControl } from "../../game-control.js";
import { moves } from "./moves/moves.js";
import { startingServerData } from "./misc/starting-server-data.js";

export const appGameNoBoard: GameControl = {
    name: "acesup",
    setup: startingServerData as GameControl["setup"],

    minPlayers: 1,
    maxPlayers: 8,

    moves: moves,
};
