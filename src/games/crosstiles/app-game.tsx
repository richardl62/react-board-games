import React from "react";
import { ActivePlayers } from "boardgame.io/core";
import { AppGame, GameCategory } from "../../app-game-support";
import { bgioMoves } from "./server-side/moves";
import { startingServerData } from "./server-side/server-data";
import { Ctx } from "boardgame.io";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { standardBoard } from "../../app-game-support/standard-board";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {

    displayName: "CrossTiles",
    category: GameCategory.standard,

    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,

    setup: (ctx: Ctx) => startingServerData(ctx),
    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },

    board: (props: WrappedGameProps) => standardBoard(LazyBoard, props),
};
