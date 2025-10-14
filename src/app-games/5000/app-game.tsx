import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import React from "react";
import { appGameNoBoard } from "../../game-controlX/games/5000/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    ...appGameNoBoard,
    
    displayName: "5000",
    category: GameCategory.standard,

    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
