import { makeGridGame, makeGridGameState } from "../../grid-based-games";
import { moveFunction } from "./move-function";
import { Piece } from "./piece";

interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

function draughts({ name, nRows, nCols, nRowsOfPieces }: DraughtProps) {

    const startingPiece = (row: number, col: number) => {
        let name = null;

        const isBlackSquare = (row + col) % 2 === 1; //Kludge?
        if (isBlackSquare) {
            if (row < nRowsOfPieces) {
                name = 'w';
            }
            if (nRows - row <= nRowsOfPieces) {
                name = 'b';
            }
        }

        return name;
    }

    let pieces = Array(nRows);
    for (let row = 0; row < nRows; ++row) {
        pieces[row] = Array(nCols);
        for (let col = 0; col < nCols; ++col) {
            pieces[row][col] = startingPiece(row, col);
        }
    }

    return makeGridGame ({
        displayName: name,

        minPlayers: 1,
        maxPlayers: 2,

        setup: () => makeGridGameState(pieces),

        offBoardPieces: {
            top: ['w', 'W'],
            bottom: ['b', 'B'],
        },

        onMove: moveFunction,

        boardStyle: {
            checkered: true,
            labels: true,
        },

        renderPiece: Piece,
    });
}

const games = [
    draughts({
        name: "Draughts (British)",
        nRows: 8, nCols: 8, nRowsOfPieces: 3,
    }),

    draughts({
        name: "Draughts (International)",
        nRows: 10, nCols: 10, nRowsOfPieces: 4,
    }),
];
export default games;