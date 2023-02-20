import { AppGame, GameCategory } from "../../../app-game-support";
import { Ctx } from "boardgame.io";
import { startingServerData } from "../game-control/starting-server-data";
import { bgioMoves } from "../game-control/moves";
import { standardBoard } from "../../../app-game-support/standard-board";
import React from "react";

const LazyBoard = React.lazy(() => import("../board/board"));

export const appGame: AppGame = {
    name: "acesup",
    displayName: "Aces Up",
    category: GameCategory.development,

    setup: (ctx: Ctx) => startingServerData(ctx),

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    board: (props) => standardBoard(LazyBoard, props),
};
