import React from "react";
import { AppGame, GameCategory } from "../../app-game-support/app-game";
import { standardBoard } from "../../app-game-support/standard-board";
import { appGameNoBoard } from "@game-control/games/aces-up/game-control";
import { setupOptions } from "./game-support/setup-options";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    ...appGameNoBoard,

    displayName: "Aces Up",
    category: GameCategory.standard,

    options: setupOptions,
    board: props => standardBoard(LazyBoard, props),
};