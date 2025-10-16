import { ActivePlayers, GameControl } from "@/game-controlX/game-control";
import { bgioMoves } from "./moves/moves";
import { startingServerData } from "./starting-server-data";

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