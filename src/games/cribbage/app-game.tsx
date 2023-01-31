import { ActivePlayers } from "boardgame.io/core";
import { AppGame, GameCategory } from "../../app-game-support";
import { startingServerData } from "./server-side/starting-server-data";
import { bgioMoves } from "./server-side/moves";
import { Ctx } from "boardgame.io";
import { makeStandardBoard } from "../../app-game-support/make-standard-board";

export const appGame: AppGame = {
    name: "Cribbage",
    displayName: "Cribbage",
    category: GameCategory.development,

    setup: (ctx: Ctx) => startingServerData(ctx),

    minPlayers: 2,
    maxPlayers: 2,

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },

    board: makeStandardBoard(() => import("./board/board"))
};
