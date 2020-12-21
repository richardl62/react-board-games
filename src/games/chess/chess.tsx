import { FC } from 'react';
import BoardGame, { checkered } from '../../simple-board-game';
import { Chess as ChessPiece } from '../pieces';

type PieceArray = Array<Array<string | null>>;

type Props = {
  pieces: PieceArray;
}
let Chess:FC<Props> = ({pieces} : Props) => {
    const options = {
      style: checkered,
      borderLabels: true,
  
      pieces: pieces,

      copyablePieces: {
        top: ['p', 'n',  'b',  'r',  'q',  'k'],
        bottom: ['P', 'N',  'B',  'R',  'Q',  'K' ],
      },
  
      makePiece: (name: string) => (<ChessPiece piece={name} />),
    };
  
    return <BoardGame {...options} />
  }

  function ChessStandard() {

    const pieces = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    return <Chess pieces={ pieces } />;
}

function Chess5ASide() {

    const pieces = [
        ['r', 'n', 'b', 'q', 'k'],
        ['p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K'],
    ];

    return  <Chess pieces={ pieces } />
}

export { ChessStandard, Chess5ASide }