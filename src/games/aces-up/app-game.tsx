import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import {OuterBoard} from "./board/outer-board";
import { bgioMoves } from "./game-control/moves";
import { startingServerData } from "./game-control/starting-server-data";
import { standardBoard } from "../../app-game-support/standard-board";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { setupOptions } from "./game-support/config";
const LazyBoard = React.lazy(() => import("./board/inner-board"));

export const appGame: AppGame = {
    name: "acesup",
    displayName: "Aces Up",
    category: GameCategory.standard,

    options: setupOptions,
    setup: startingServerData,

    minPlayers: 1,
    maxPlayers: 8,



    moves: bgioMoves,

    board: (props: WrappedGameProps) => <OuterBoard {...props}>
        {standardBoard(LazyBoard, props)}
    </OuterBoard>,
};
