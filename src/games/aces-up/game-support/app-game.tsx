import { Ctx } from "boardgame.io";
import { AppGame, GameCategory } from "../../../app-game-support";
import Board from "../board/board";
import { bgioMoves } from "../game-control/moves";
import { startingServerData } from "../game-control/starting-server-data";

export const appGame: AppGame = {
    name: "acesup",
    displayName: "Aces Up",
    category: GameCategory.development,

    setup: (ctx: Ctx) => startingServerData(ctx),

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    board: Board,
};
