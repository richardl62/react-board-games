import { FC } from 'react';
import BoardGame, {checkered} from '../simple-board-game';

interface PieceParams {
    name: string;
};

const Piece: FC<PieceParams> = ({ name }: PieceParams) => {
    return <div>{name}</div>;
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

        makePiece: (name: string) => (<Piece name={name} />),
    };

    return <BoardGame options={options} />
}

export default Draughts;