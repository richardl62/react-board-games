import React from "react";
import { AppGame } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { appGameNoBoard } from "./app-game-no-board";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./client-side/board"));

export const appGame: AppGame = {
    ...appGameNoBoard,

    options: setupOptions,
    board: (props) => standardBoard(LazyBoard, props),
};
