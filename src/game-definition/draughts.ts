//import { PiecePosition, BoardPieces } from '../interfaces'
import { GameDefinitionInput } from './game-definition'; 
import RenderPiece from './draughts-piece';

interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
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