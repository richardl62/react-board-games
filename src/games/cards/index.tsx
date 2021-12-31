import React from "react";
import { AppGame, GameCategory } from "../../shared/types";
import { CardGame } from "./card-game";

const game: AppGame = {
    name: "cards",
    displayName: "Cards",
    category: GameCategory.development,

    setup: () => null,

    minPlayers: 1,
    maxPlayers: 1,

    moves: {
    },

    board: () => <CardGame/>,
};

export default [ game ];