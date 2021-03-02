//import { PiecePosition, BoardPieces } from '../interfaces'
import { GameDefinitionInput, defaultMoveFunction, 
    PiecePosition, RowCol, makeRowCol,
    MoveControl, MoveResult } from './creation'
import RenderPiece from './draughts-piece';


interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

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

function moveFunction(from: PiecePosition, to: PiecePosition | null, moveControl: MoveControl) {
    const fromRowCol = makeRowCol(from);
    const toRowCol = makeRowCol(to);
    if(fromRowCol && toRowCol) {
        const fromPiece = moveControl.piece(from);
        const path = findDiagonalPath(fromRowCol, toRowCol);
        if(path && !moveControl.piece(to!)) {
            path.forEach(pos => moveControl.setPiece(pos, null));
            moveControl.setPiece(toRowCol, fromPiece);
            return new MoveResult('endOfTurn');
        }

        return new MoveResult('noop');
    } else {
        return defaultMoveFunction(from, to, moveControl);
    }
}

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

        onMove: moveFunction,
    };
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
