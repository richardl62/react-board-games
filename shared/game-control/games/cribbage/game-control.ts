import { ActivePlayers, GameControl } from "../../game-control.js";
import { bgioMoves } from "./moves/moves.js";
import { startingServerData } from "./starting-server-data.js";

export const appGameNoBoard: GameControl = {
    name: "cribbage",

    setup: startingServerData,

    minPlayers: 2,
    maxPlayers: 2,

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },
};