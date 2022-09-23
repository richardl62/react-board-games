import React, { Suspense } from "react";
import { AppGame, GameCategory } from "../../app-game-support";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";

const LazyBoardWrapper = React.lazy(() => import("./board/board-wrapper"));

export const appGame: AppGame = {
    name: "Cribbage",
    displayName: "Cribbage",
    category: GameCategory.development,

    setup: () => null,

    minPlayers: 1,
    maxPlayers: 1,

    moves: {
    },

    board: (props: WrappedGameProps) => {
        return <Suspense fallback={<div>Loading...</div>}>
            <LazyBoardWrapper gameProps={props} />
        </Suspense>;
    }
};