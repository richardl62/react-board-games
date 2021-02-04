//import { PiecePosition, BoardPieces } from '../interfaces'
import { GameDefinitionInput, MakeMove, Board } from './game-definition'; 
import RenderPiece from './draughts-piece';

interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

const makeMove : MakeMove = ({from, to, pieces}) => {

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    if(Math.abs(rowDiff) === Math.abs(colDiff)) {
        let board = new Board(pieces);
        board.move(from, to);

        let row = from.row;
        let col = from.col;
        while(row !== to.row) {
            board.set({row:row, col:col}, null);
            row += row > to.row ? -1 : 1;
            col += col > to.col ? -1 : 1;
        }
        return 'end-turn'
    }
    return 'bad';
}

// Use of gameDefinitionInput is not necessary, but it allows type checking to be
// done here rather than at point of use.
function draughts({ name, nRows, nCols, nRowsOfPieces }: DraughtProps) : GameDefinitionInput  {

    const startingPiece = (row: number, col: number) => {
        let name = null;
       
        const isBlackSquare = (row+col) % 2 === 1; //Kludge?
        if(isBlackSquare) {
            if(row < nRowsOfPieces) {
                name = 'w';
            }
            if(nRows - row <= nRowsOfPieces)
            {
                name = 'b';
            }
        }

        return name;
    }

    let pieces = Array(nRows);
    for(let row = 0; row < nRows; ++row) {
        pieces[row] = Array(nCols);
        for(let col = 0; col < nCols; ++col) {
            pieces[row][col] = startingPiece(row, col);
        }
    }

    return {
        name: name,
        gameType: "draughts",

        renderPiece: RenderPiece,

        boardStyle: {
            checkered: true,
            labels: true,
        },

        pieces: pieces,

        offBoardPieces: {
            top: ['w', 'W'],
            bottom: ['b', 'B' ],
          },

        makeMove: makeMove,
    };
}

const games = [
    draughts({
        name: "Draughts",
        nRows: 8, nCols: 8, nRowsOfPieces: 3,
    }),

    draughts({
        name: "Draughts 10x10",
        nRows: 10, nCols: 10, nRowsOfPieces: 3,
    }),
];
 
export default games;
