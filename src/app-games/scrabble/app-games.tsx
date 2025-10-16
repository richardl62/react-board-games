import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { standardBoard } from "../../app-game-support/standard-board";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { appGamesNoBoardSimple, appGamesNoBoardStandard} from "../../game-controlX/games/scrabble/game-control";
import { setupOptions } from "./options";

const LazyBoard = React.lazy(() => import("./board/board-wrapper"));

const appGameSimple: AppGame = {
    ...appGamesNoBoardSimple,

    displayName: "Simple Scrabble",
    category: GameCategory.test,
    
    options: setupOptions,
    board: (props: WrappedGameProps) => standardBoard(LazyBoard, props, appGamesNoBoardSimple),
};

const appGameStandard: AppGame = {
    ...appGamesNoBoardStandard,
    
    displayName: "Scrabble",
    category: GameCategory.standard,

    options: setupOptions,
    board: (props: WrappedGameProps) => standardBoard(LazyBoard, props, appGamesNoBoardStandard),
};

export const appGames = [appGameSimple, appGameStandard];
