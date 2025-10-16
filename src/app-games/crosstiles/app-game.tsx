import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { appGameNoBoard } from "@game-control/games/crosstiles/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board"));


export const appGame: AppGame = {
    ...appGameNoBoard,

    displayName: "CrossTiles",
    category: GameCategory.standard,

    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
