import { AppGame, GameCategory } from "../../app-game-support";
import { Ctx } from "boardgame.io";
import { startingServerData } from "./server-side/server-data";
import { bgioMoves } from "./server-side/moves";
import { standardBoard } from "../../app-game-support/standard-board";

import React from "react";

const options = {
    rackSize: {
        default: 2,
        label: "Starting value",
        min: 0,
        max: 10,
    },
};

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    name: "plusminus",
    displayName: "Plus Minus",
    category: GameCategory.test,

    startupValues: options,

    setup: (ctx: Ctx, startupData: unknown) => {
        console.log("startupData", startupData);
        return startingServerData(ctx);
    }, 
    
    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    // BGIO does not impose turn order
    // turn: {
    //     activePlayers: ActivePlayers.ALL,
    // },

    board: (props) => standardBoard(LazyBoard, props),
};
