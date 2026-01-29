import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { BoardProps } from "../../app-game-support/board-props";
import { gameControlSimple, gameControlStandard} from "@game-control/games/scrabble/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board-wrapper"));

const appGameSimple: AppGame = {
    ...gameControlSimple,

    displayName: "Simple Scrabble",
    category: GameCategory.test,
    
    options: setupOptions,
    board: (props: BoardProps) => standardBoard(LazyBoard, props, gameControlSimple),
};

const appGameStandard: AppGame = {
    ...gameControlStandard,
    
    displayName: "Scrabble",
    category: GameCategory.standard,

    options: setupOptions,
    board: (props: BoardProps) => standardBoard(LazyBoard, props, gameControlStandard),
};

export const appGames = [appGameSimple, appGameStandard];
