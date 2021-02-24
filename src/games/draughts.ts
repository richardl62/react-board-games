//import { PiecePosition, BoardPieces } from '../interfaces'
import { GameDefinitionInput, makeOnClickFunction, defaultMoveFunction, 
    PiecePosition, RowCol, makeRowCol, MoveControl, MoveResult } from '../game-creation'
import RenderPiece from './draughts-piece';


interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

// function isWhite(piece: string) {
//     return piece.toLowerCase()[0] === 'w';
// }

// function makeKing(piece: string) {
//     return piece.toUpperCase();
// }

// function isKing(piece: string) {
//     return piece === makeKing(piece);
// }

// const makeMove: MakeMove = ({ from, to, pieces }) => {
//     let board = new Board(pieces);

//     const rowDiff = to.row - from.row;
//     const colDiff = to.col - from.col;

//     if (Math.abs(rowDiff) === Math.abs(colDiff)) {
//         const fromPiece = nonNull(board.get(from));

//         let row = from.row;
//         let col = from.col;
//         while (row !== to.row) {
//             board.set({ row: row, col: col }, null);
//             row += row > to.row ? -1 : 1;
//             col += col > to.col ? -1 : 1;
//         }

//         const finalRow = isWhite(fromPiece) ? board.nRows - 1 : 0;
//         board.set(to, 
//             (to.row === finalRow) ? makeKing(fromPiece) : fromPiece,
//             );

//     } else {
//         // KLUDGE: The move is illegal. This should never happen with click-moves.
//         // But at time of writting, it was allowed, and sometime useful, with
//         // drags.
//         console.log("Warning non-diagonal move made");
//         board.move(from, to);
//     }
    
//     let result = new MoveResult();
//     result.endOfTurn = true;
//     return result;
// }

// function legalMovesDirected (
//     board: Board,
//     from: PiecePosition,
//     legalMoves: Array<Array<boolean>>,
//     rDelta: number,
//     cDelta: number,
// ) {
//     const current = nonNull(board.get(from));

//     let r = from.row + rDelta;
//     let c = from.col + cDelta;
//     const next = board.get2(r, c);

//     // Allow moves to empty squares, or jumps over opposing squares
//     if (next === null) {
//         legalMoves[r][c] = true;
//     } else if (next && isWhite(next) !== isWhite(current)) {
//         r += rDelta;
//         c += cDelta;
//         if (board.get2(r, c) === null) {
//             legalMoves[r][c] = true;
//         }
//     }
// }

// const legalMoves: LegalMoves = ({ from, pieces }) => {
//     const board = new Board(pieces);
    
//     const fromPiece = nonNull(board.get(from));

//     let legalMoves = pieces.map(row => row.map(() => false));

//     if(isWhite(fromPiece) || isKing(fromPiece)) {
//         legalMovesDirected(board, from, legalMoves, 1, 1);
//         legalMovesDirected(board, from, legalMoves, 1, -1);
//     }

//     if(!isWhite(fromPiece) || isKing(fromPiece)) {
//         legalMovesDirected(board, from, legalMoves, -1, 1);
//         legalMovesDirected(board, from, legalMoves, -1, -1);
//     }


//     return legalMoves;
// }

// Find the steps in a diagonal path [from, to).
function findDiagonalPath(from: RowCol, to: RowCol) {
    const step = (num: number) => num > 0 ? 1 : -1;

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    if(Math.abs(rowDiff) === Math.abs(colDiff)) {
        let positions = [];

        let {row, col} = from;
        while(row !== to.row) {
            positions.push({row:row, col: col})
            row += step(rowDiff);
            col += step(colDiff);
        }
        return positions;
    } 

    return null;
}

function moveFunction(from: PiecePosition, to: PiecePosition, moveControl: MoveControl) {
    const fromRowCol = makeRowCol(from);
    const toRowCol = makeRowCol(to);
    if(fromRowCol && toRowCol) {
        const fromPiece = moveControl.piece(from);
        const path = findDiagonalPath(fromRowCol, toRowCol);
        if(path && !moveControl.piece(to)) {
            path.forEach(pos => moveControl.setPiece(pos, null));
            moveControl.setPiece(toRowCol, fromPiece);
            return new MoveResult('endOfTurn');
        }

        return new MoveResult('noop');
    } else {
        return defaultMoveFunction(from, to, moveControl);
    }
}

const onClick = makeOnClickFunction(moveFunction);
// Use of gameDefinitionInput is not necessary, but it allows type checking to be
// done here rather than at point of use.
function draughts({ name, nRows, nCols, nRowsOfPieces }: DraughtProps): GameDefinitionInput {

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

    return {
        name: name,

        renderPiece: RenderPiece,

        boardStyle: {
            checkered: true,
            labels: true,
        },

        initialState: {
            pieces: pieces,
        },

        offBoardPieces: {
            top: ['w', 'W'],
            bottom: ['b', 'B'],
        },

        onClick: onClick,
    };
}

const games = [
    draughts({
        name: "Draughts",
        nRows: 8, nCols: 8, nRowsOfPieces: 3,
    }),

    draughts({
        name: "Thump (Ghanaian draughts)",
        nRows: 10, nCols: 10, nRowsOfPieces: 4,
    }),
];

export default games;
