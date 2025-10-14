import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { appGameNoBoard } from "../../game-controlX/games/swap-squares/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./client-side/board"));

export const appGame: AppGame = {
    ...appGameNoBoard,

    displayName: "Swap Squares",
    category: GameCategory.test,

    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
