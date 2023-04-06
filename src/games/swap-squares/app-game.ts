import React from "react";
import { AppGame } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { appGameNoBoard } from "./app-game-no-board";

const LazyBoard = React.lazy(() => import("./client-side/board"));

export const appGame: AppGame = {
    ...appGameNoBoard,

    boardX: (props) => standardBoard(LazyBoard, props),
};
