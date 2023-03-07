import React from "react";
import { Ctx } from "boardgame.io";
import { AppGame, GameCategory } from "../../app-game-support";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { initialSquares, ServerData, startingServerData } from "./server-data";
import { standardBoard } from "../../app-game-support/standard-board";

const LazyBoard = React.lazy(() => import("./board"));

export const appGame: AppGame = {
    name: "swap-squares",
    displayName: "Swap Squares",
    category: GameCategory.test,

    setup: startingServerData,

    minPlayers: 1,
    maxPlayers: 1,

    moves: {
        swap: (G: ServerData, _ctx: Ctx, from: number, to: number) => {
            if (from !== to) {
                const tmp = G.squares[to];
                G.squares[to] = G.squares[from];
                G.squares[from] = tmp;
            }
        },

        // Using the BGIO supplied reset function lead to server errros.
        // TO DO: Understand why this happened;
        reset: (G: ServerData /*, ctx: Ctx*/) => {
            G.squares = [...initialSquares];
        },
    },

    board: (props: WrappedGameProps) => standardBoard(LazyBoard, props),
};