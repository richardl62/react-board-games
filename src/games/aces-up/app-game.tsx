import React from "react";
import { AppGame } from "../../app-game-support/app-game";
import { standardBoard } from "../../app-game-support/standard-board";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { appGameNoBoard } from "./app-game-no-board";
import { OuterBoard } from "./board/outer-board";
const LazyBoard = React.lazy(() => import("./board/inner-board"));

export const appGame: AppGame = {
    ...appGameNoBoard,

    board: (props: WrappedGameProps) => <OuterBoard {...props}>
        {standardBoard(LazyBoard, props)}
    </OuterBoard>,
};