import { AppGame } from "../../shared/types";
import { Piece } from "./piece";

interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

export //TEMPORARY KLUDGE
function draughts({ name, nRows, nCols, nRowsOfPieces }: DraughtProps): {
    displayName: string; minPlayers: number; maxPlayers: number;
    //setup: () => makeGridGameState(pieces),
    offBoardPieces: { top: string[]; bottom: string[]; };
    //onMove: moveFunction,
    boardStyle: { checkered: boolean; labels: boolean; }; renderPiece: ({ pieceName }: DraughtsProps) => JSX.Element;
} {

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

    const pieces = Array(nRows);
    for (let row = 0; row < nRows; ++row) {
        pieces[row] = Array(nCols);
        for (let col = 0; col < nCols; ++col) {
            pieces[row][col] = startingPiece(row, col);
        }
    }

    return {
        displayName: name,

        minPlayers: 1,
        maxPlayers: 2,

        //setup: () => makeGridGameState(pieces),

        offBoardPieces: {
            top: ['w', 'W'],
            bottom: ['b', 'B'],
        },

        //onMove: moveFunction,

        boardStyle: {
            checkered: true,
            labels: true,
        },

        renderPiece: Piece,
    };
}

const games: Array<AppGame> = [
    // draughts({
    //     name: "Draughts (British)",
    //     nRows: 8, nCols: 8, nRowsOfPieces: 3,
    // }),

    // draughts({
    //     name: "Draughts (International)",
    //     nRows: 10, nCols: 10, nRowsOfPieces: 4,
    // }),
];
export default games;
