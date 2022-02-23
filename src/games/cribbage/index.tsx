import React from "react";
import { AppGame, GameCategory } from "../../app-game-support";

import { GameWrapper } from "./game-wrapper";

const game: AppGame = {
    name: "Cribbage",
    displayName: "Cribbage",
    category: GameCategory.development,

    setup: () => null,

    minPlayers: 1,
    maxPlayers: 1,

    moves: {
    },

    board: () => <GameWrapper/>,
};

export default [ game ];