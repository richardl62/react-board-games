import { ActivePlayers } from "@/game-controlX/game";
import { GameControl } from "@/game-controlX/game-control";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/starting-server-data";

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