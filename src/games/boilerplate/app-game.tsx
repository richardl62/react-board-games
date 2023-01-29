import React, { Suspense } from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { Ctx } from "boardgame.io";

const LazyBoard = React.lazy(() => import("./board/board"));

export const appGame: AppGame = {
    name: "dummy",
    displayName: "Dummy",
    category: GameCategory.test,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setup: (ctx: Ctx) => {return {};},

    minPlayers: 1,
    maxPlayers: 8,

    moves: {},

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
