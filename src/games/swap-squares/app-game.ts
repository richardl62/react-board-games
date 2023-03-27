import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { startingServerData } from "./server-side/server-data";
import { standardBoard } from "../../app-game-support/standard-board";
import { bgioMoves } from "./server-side/moves";

const LazyBoard = React.lazy(() => import("./client-side/board"));

export const appGame: AppGame = {
    name: "swap-squares",
    displayName: "Swap Squares",
    category: GameCategory.test,

    setup: startingServerData,

    minPlayers: 1,
    maxPlayers: 1,

    moves: bgioMoves,

    board: (props: WrappedGameProps) => standardBoard(LazyBoard, props),
};