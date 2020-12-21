import {checkered} from '../../simple-board-game';
import { Counter } from '../pieces';

function pieceColor(black: boolean) {
    return black ? 'black' : 
        'rgb(230 220 200)'  // kludge? Depemds (sort of) on color of squares on board
    ;
}

function makePiece(name: string) {

    const isBlack = name.toLowerCase() === 'b';
    const isKing =  name === name.toUpperCase();;

    return (
        <Counter color={pieceColor(isBlack)}
            text={isKing ? "K" : null}
            textColor={pieceColor(!isBlack)}
        />
    );
}

interface DraughtProps {
    name: string,
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

function draughts({ name, nRows, nCols, nRowsOfPieces }: DraughtProps) {

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
        displayName: name,
        style: checkered,
        borderLabels: true,

        copyablePieces: {
            top: ['w', 'W'],
            bottom: ['b', 'B' ],
          },

        pieces: pieces,

        makePiece: makePiece,
    };
}

const games = {
    draughts: draughts({
        name: "Draughts",
        nRows: 8, nCols: 8, nRowsOfPieces: 3,
    }),

    draughts10x10: draughts({
        name: "Draughts 10x10",
        nRows: 10, nCols: 10, nRowsOfPieces: 3,
    }),
};
  
export default games;