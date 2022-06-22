import React from "react";
import { ActivePlayers } from "boardgame.io/core";
import { AppGame, GameCategory, WrappedGameProps } from "../../../app-game-support";
import { bgioMoves } from "../server-side/moves";
import { startingServerData } from "../server-side/server-data";
import { Ctx } from "boardgame.io";
import { Board } from "../board/board";

const game: AppGame = {

    displayName: "CrossTiles",
    category: GameCategory.development,

    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,

    setup: (ctx: Ctx) => startingServerData(ctx),
    moves: bgioMoves,

    turn: {
        activePlayers: ActivePlayers.ALL,
    },

    board: (props: WrappedGameProps) => <Board gameProps={props} />,
};

const games = [game];

export default games;