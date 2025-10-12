import { ActivePlayers } from "@/game-controlX/types/game";
import { GameCategory } from "../../app-game-support";
import { GameControl } from "../../app-game-support/app-game";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/starting-server-data";

export const appGameNoBoard: GameControl = {
    name: "Cribbage",
    displayName: "Cribbage",
    category: GameCategory.development,

    setup: startingServerData,

    minPlayers: 2,
    maxPlayers: 2,

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },
};