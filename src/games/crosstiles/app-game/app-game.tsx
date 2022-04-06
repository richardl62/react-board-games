import React from "react";
import { ActivePlayers } from "boardgame.io/core";
import { AppGame, GameCategory, WrappedGameProps } from "../../../app-game-support";
import Board from "./board-wrapper";
import { bgioMoves } from "../server-side/moves";
import { startingServerData } from "../server-side/server-data";

const game: AppGame = {

    displayName: "CrossTiles",
    category: GameCategory.development,

    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,

    setup: () => startingServerData(),
    moves: {},

    turn: {
        activePlayers: {all: {stage: "stage1"}},
        stages: {
            stage1: {
                moves: bgioMoves,
            },
        },
    },

    board: (props: WrappedGameProps) => <Board appBoardProps={props} />,
};

const games = [game];

export default games;