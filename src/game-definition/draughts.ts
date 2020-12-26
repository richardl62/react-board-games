// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinition } from '../interfaces';


interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

function draughts({ name, nRows, nCols, nRowsOfPieces }: DraughtProps) : GameDefinition  {

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