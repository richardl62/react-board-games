import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import React from "react";
import { appGameNoBoard } from "@/game-controlX/games/ticker/game-control";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame= {
    ...appGameNoBoard,

    displayName: "Ticker",
    category: GameCategory.test,

    board: (props) => standardBoard(LazyBoard, props),
};
