import React, { Suspense } from "react";
import { ActivePlayers } from "boardgame.io/core";
import { AppGame, GameCategory } from "../../app-game-support";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { startingServerData } from "./server-side/starting-server-data";
import { bgioMoves } from "./server-side/moves";

const LazyBoardWrapper = React.lazy(() => import("./board/board-wrapper"));

export const appGame: AppGame = {
    name: "Cribbage",
    displayName: "Cribbage",
    category: GameCategory.development,

    setup: () => startingServerData(),

    minPlayers: 1,
    maxPlayers: 2,

    moves: bgioMoves,

    // BGIO does not impose turn order
    turn: {
        activePlayers: ActivePlayers.ALL,
    },

    board: (props: WrappedGameProps) => {
        return <Suspense fallback={<div>Loading...</div>}>
            <LazyBoardWrapper gameProps={props} />
        </Suspense>;
    }
};
