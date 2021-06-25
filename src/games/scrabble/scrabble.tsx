import { SquareID } from "../../boards";
import { AppGame } from "../../shared/types";

type Pieces = (string | null)[][];
type G = {
    pieces: Pieces,
    moveStart: SquareID | null,
}

function Scrabble() {
    return <div>Scrabble</div>
}

export const scrabble: AppGame = {

    name: 'scrabble',
    displayName: 'Scrabble',

    minPlayers: 1,
    maxPlayers: 1, //TEMPORARY
    setup: (): G => {
        return {
            pieces: [
                ['a', 'b', 'c'],
                [],
                ['x', 'y', 'z'],
            ],
            moveStart: null,
        }
    },

    moves: {

    },

    board: Scrabble,
};
