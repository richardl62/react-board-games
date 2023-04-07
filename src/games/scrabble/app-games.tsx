import React from "react";
import { AppGame } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { appGamesNoBoard } from "./app-games-no-board";

const LazyBoard = React.lazy(() => import("./board/board-wrapper"));

export const appGames: AppGame [] = 
    appGamesNoBoard.map(game => {
        return {
            ...game,
            board: (props: WrappedGameProps) => standardBoard(LazyBoard, props, game),
        };
    });

