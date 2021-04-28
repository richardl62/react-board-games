import { makeAppGridGame } from "../../layout/grid-based-board";
import { draughtsInput } from "./draughts-input";
import { DraughtsPiece } from "./draughts-piece";

const games = draughtsInput.map(input => {
    const boardStyle = {
        checkered: true,
        labels: true,
    };

    return makeAppGridGame(input, boardStyle, DraughtsPiece);
});

export default games;