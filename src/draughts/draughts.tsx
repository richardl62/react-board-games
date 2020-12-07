import { FC } from 'react';
import BoardGame, {checkered} from '../simple-board-game';
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
    nRows: number;
    nCols: number;
    nRowsOfPieces: number;
}

const Draughts: FC<DraughtProps> = ({ nRows, nCols, nRowsOfPieces }: DraughtProps) => {

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

    const options = {
        style: checkered,
        borderLabels: true,

        copyable: {
            top: ['w', 'W'],
            bottom: ['b', 'B' ],
          },

        pieces: pieces,

        makePiece: makePiece,
    };

    return <BoardGame {...options} />
}

export default Draughts;