import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";

import { Board } from "./board/board";

export const appGame: AppGame = {
    name: "Cribbage",
    displayName: "Cribbage",
    category: GameCategory.development,

    setup: () => null,

    minPlayers: 1,
    maxPlayers: 1,

    moves: {
    },

    board: () => <Board/>,
};
