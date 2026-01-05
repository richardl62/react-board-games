import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { gameControl } from "@game-control/games/cant-stop/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    ...gameControl,

    displayName: "Cant Stop",
    category: GameCategory.development,
    
    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
