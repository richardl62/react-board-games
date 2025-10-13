import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { appGameNoBoard } from "./app-game-no-board";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    ...appGameNoBoard,

    displayName: "Plus Minus",
    category: GameCategory.test,
    
    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
