import { AppGame, GameCategory } from "../../app-game-support";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { standardBoard } from "../../app-game-support/standard-board";

import React from "react";
import { gameOptions } from "./options";


const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    name: "plusminus",
    displayName: "Plus Minus",
    category: GameCategory.test,

    startupValues: gameOptions,

    setup: startingServerData,
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    // BGIO does not impose turn order
    // turn: {
    //     activePlayers: ActivePlayers.ALL,
    // },

    board: (props) => standardBoard(LazyBoard, props),
};
