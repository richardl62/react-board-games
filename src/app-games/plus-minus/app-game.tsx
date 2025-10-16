import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { gameControl } from "@game-control/games/plus-minus/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    ...gameControl,

    displayName: "Plus Minus",
    category: GameCategory.test,
    
    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
