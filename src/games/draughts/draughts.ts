import { DraughtsPiece } from "./draughts-piece";
import { makeAppGridGame } from "../../layout/grid-based-board/make-app-grid-game";
import { draughtsInput } from "./draughts-input";

const games = draughtsInput.map(input => {
    const boardStyle = {
        checkered: true,
        labels: true,
    };

    return makeAppGridGame(input, boardStyle, DraughtsPiece);
});

export default games;