import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { gameControl } from "@game-control/games/random-draw/game-control";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    ...gameControl,

    displayName: "Random Draw",
    category: GameCategory.test,
    
    options: {},
    board: (props) => standardBoard(LazyBoard, props),
};
