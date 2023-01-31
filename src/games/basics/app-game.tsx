import React, { Suspense } from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { Ctx } from "boardgame.io";
import { startingServerData } from "./server-side/starting-server-data";
import { bgioMoves } from "./server-side/moves";

const LazyBoard = React.lazy(() => import("games/basics/board/board"));

export const appGame: AppGame = {
    name: "basics",
    displayName: "Basics",
    category: GameCategory.test,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setup: (ctx: Ctx) => startingServerData(),

    minPlayers: 1,
    maxPlayers: 8,

    moves: bgioMoves,

    // BGIO does not impose turn order
    // turn: {
    //     activePlayers: ActivePlayers.ALL,
    // },

    board: (props: WrappedGameProps) => {
        return <Suspense fallback={<div>Loading...</div>}>
            <LazyBoard gameProps={props} />
        </Suspense>;
    }
};
