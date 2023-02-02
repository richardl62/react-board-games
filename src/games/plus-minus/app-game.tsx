import { AppGame, GameCategory } from "../../app-game-support";
import { Ctx } from "boardgame.io";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { makeStandardBoard } from "../../app-game-support/make-standard-board";

export const appGame: AppGame = {
    name: "plusminus",
    displayName: "Plus Minus",
    category: GameCategory.test,

    setup: (ctx: Ctx) => startingServerData(ctx), 
    

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    // BGIO does not impose turn order
    // turn: {
    //     activePlayers: ActivePlayers.ALL,
    // },

    board: makeStandardBoard(() => import("./board/board")),
};
