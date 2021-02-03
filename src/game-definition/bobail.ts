// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { BoardPieces } from '../interfaces';
import { GameDefinitionInput, Board } from './game-definition';
import RenderPiece from './bobail-piece';

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';

type LegalMoves = NonNullable<GameDefinitionInput["legalMoves"]>;
type MakeMove = NonNullable<GameDefinitionInput["makeMove"]>;

// Get the connects of a square. Return undefined if the row and column
// and not on the board.
function piece( pieces: BoardPieces, row: number, col:number) {
        return pieces[row] && pieces[row][col];
    }

// Record as legal the empty squares that are one step in any direction
// (including diagonally) from the selected square.
const legalMovesBobail: LegalMoves = ({ selectedSquare, pieces }) => {
    const s = selectedSquare;

    let result = pieces.map(row => row.map(() => false));
    for (let row = s.row - 1; row <= s.row + 1; ++row) {
        for (let col = s.col - 1; col <= s.col + 1; ++col) {
            result[row][col] = piece(pieces, row, col) === null;
        }
    }

    return result;
};

function legalMovesPieceDirected(
    { selectedSquare, pieces }: Parameters<LegalMoves>[0],
    legalMoves: Array<Array<boolean>>,
    rStep: number, cStep: number
    ) {

    let { row, col } = selectedSquare;

    while (piece(pieces, row + rStep, col + cStep) === null) {
        row += rStep;
        col += cStep;
    }

    if (pieces[row][col] === null) {
        legalMoves[row][col] = true;
    }

    return legalMoves;
}

// Record as legal the last empty square found when stepping in
// each direction (including diagonal) from the selected square.
const legalMovesPiece : LegalMoves = (args) => {

    let legalMoves = args.pieces.map(row => row.map(() => false));

    for (let rStep = -1; rStep <= 1; rStep++) {
        for (let cStep = -1; cStep <= 1; cStep++) {
            if (rStep || cStep) {
                legalMovesPieceDirected(args, legalMoves, rStep, cStep);
            }
        }
    }

    return legalMoves;
};

const legalMoves: LegalMoves = (args) => {
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

    return null;
}

const makeMove: MakeMove = ({from, to, pieces}) => {
    let board = new Board(pieces);
    let movingBobail = board.get(from) === bb;

    board.move(from, to);

    // The turn ends when a piece other than the bobail is moved.
    return movingBobail ? 'continue' : 'end-turn';

}

const games: Array<GameDefinitionInput> = [
    {
        name: 'bobail',

        gameType: 'bobail',

        boardStyle: {
            checkered: false,
            labels: true,
        },

        renderPiece: RenderPiece,

        pieces: [
            [pl1, pl1, pl1, pl1, pl1],
            [null, null, null, null, null],
            [null, null, bb, null, null],
            [null, null, null, null, null],
            [pl2, pl2, pl2, pl2, pl2],
        ],

        offBoardPieces: { top: [], bottom: [], },

        legalMoves: legalMoves,

        makeMove: makeMove,
    }
];

export default games;