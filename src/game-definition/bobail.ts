// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinition, LegalMovesArg } from '../interfaces';

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';

type Pieces = LegalMovesArg["pieces"];
// Get the connects of a square. Return undefined if the row and column
// and not on the board.
function piece( pieces: Pieces, row: number, col:number) {
        return pieces[row] && pieces[row][col];
    }

// Record as legal the empty squares that are one step in any direction
// (including diagonally) from the selected square.
function legalMovesBobail({ selectedSquare, pieces, legalMoves }: LegalMovesArg) {
    const s = selectedSquare;

    for (let row = s.row - 1; row <= s.row + 1; ++row) {
        for (let col = s.col - 1; col <= s.col + 1; ++col) {
            if ((row || col) // Not strictly necessary
                && piece(pieces,row,col) === null) {
                legalMoves[row][col] = true;
            }
        }
    }
};

function legalMovesPieceDirected({ selectedSquare, pieces, legalMoves }: LegalMovesArg,
    rStep: number, cStep: number) {

    let { row, col } = selectedSquare;

    while (piece(pieces, row + rStep, col + cStep) === null) {
        row += rStep;
        col += cStep;
    }

    if (pieces[row][col] === null) {
        legalMoves[row][col] = true;
    }
}

// Record as legal the last empty square found when stepping in
// each direction (including diagonal) from the selected square.
function legalMovesPiece(args: LegalMovesArg) {

    for (let rStep = -1; rStep <= 1; rStep++) {
        for (let cStep = -1; cStep <= 1; cStep++) {
            if (rStep || cStep) {
                legalMovesPieceDirected(args, rStep, cStep);
            }
        }
    }
};

function legalMoves(args: LegalMovesArg) {
    const s = args.selectedSquare;

    if (s.onBoard) {
        const p1Name = args.pieces[s.row][s.col];

        if (p1Name === bb) {
            return legalMovesBobail(args);
        } else if (p1Name === pl1 || p1Name === pl2) {
            return legalMovesPiece(args);
        } else if (p1Name) {
            throw new Error("Unexpect name for bobail piece: " + p1Name);
        }
    }
}

const games: Array<GameDefinition> = [
    {
        name: 'bobail',

        gameType: 'bobail',

        boardStyle: {
            checkered: false,
            labels: true,
        },

        pieces: [
            [pl1, pl1, pl1, pl1, pl1],
            [null, null, null, null, null],
            [null, null, bb, null, null],
            [null, null, null, null, null],
            [pl2, pl2, pl2, pl2, pl2],
        ],

        offBoardPieces: { top: [], bottom: [], },

        legalMoves: legalMoves,
    }
];

export default games;