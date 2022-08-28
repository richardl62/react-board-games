import React, { Suspense } from "react";
import { ActivePlayers } from "boardgame.io/core";
import { AppGame, GameCategory } from "../../../app-game-support";
import { bgioMoves } from "../server-side/moves";
import { startingServerData } from "../server-side/server-data";
import { Ctx } from "boardgame.io";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";

const LazyBoard = React.lazy(() => import("../board/board"));

const game: AppGame = {

    displayName: "CrossTiles",
    category: GameCategory.standard,

    name: "crosstiles",

    minPlayers: 1,
    maxPlayers: 99,

    setup: (ctx: Ctx) => startingServerData(ctx),
    moves: bgioMoves,

    turn: {
        activePlayers: ActivePlayers.ALL,
    },

    board: (props: WrappedGameProps) => {
        return <Suspense fallback={<div>Loading...</div>}>
            <LazyBoard gameProps={props} />
        </Suspense>;
    }
};

const games = [game];

export default games;