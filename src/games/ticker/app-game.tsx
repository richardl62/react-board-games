import { AppGame, GameCategory } from "../../app-game-support";
import { Ctx } from "boardgame.io";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { standardBoard } from "../../app-game-support/standard-board";

import React from "react";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    name: "ticker",
    displayName: "Ticker",
    category: GameCategory.test,

    setup: (ctx: Ctx) => startingServerData(ctx), 

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    board: (props) => standardBoard(LazyBoard, props),
};
