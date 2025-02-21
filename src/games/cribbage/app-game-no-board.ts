import { ActivePlayers } from "../../boardgame-lib/game";
import { GameCategory } from "../../app-game-support";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/starting-server-data";

export const appGameNoBoard: AppGameNoBoard = {
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