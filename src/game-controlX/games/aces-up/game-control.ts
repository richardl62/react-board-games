import { GameControl } from "@game-control/game-control";
import { moves } from "./moves/moves";
import { startingServerData } from "./misc/starting-server-data";

export const appGameNoBoard: GameControl = {
    name: "acesup",
    setup: startingServerData as GameControl["setup"],

    minPlayers: 1,
    maxPlayers: 8,

    moves: moves,
};
