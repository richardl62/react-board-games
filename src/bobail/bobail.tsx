import {FC} from 'react';
import BoardGame from '../simple-board-game';
import './bobail.css';

interface PieceParams {
    name: string;
};

const PieceNames = ['p1', 'p2', 'bb'];

const Piece:FC<PieceParams> = ({name}: PieceParams) => {
    if(!PieceNames.find(p => p === name)) {
        throw new Error(`Unrecognised name for Bobail Piece: '${name}'`)
    }
    const className = "bobail bobail-" + name; 
    return <div className={className}/>;
}

function Bobail() {

    const options = {
      pieces: [
          ['p1', 'p1', 'p1', 'p1', 'p1'],
          [null, null, null, null, null],
          [null, null, 'bb', null, null],
          [null, null, null, null, null],
          ['p2', 'p2', 'p2', 'p2', 'p2'],
      ],
  
      makePiece: (name: string ) => (<Piece name={name} />),
    };
  
    return <BoardGame options={options} />
  }

  export default Bobail;