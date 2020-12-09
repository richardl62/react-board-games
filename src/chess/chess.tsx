import { FC } from 'react';
import BoardGame, { checkered } from '../simple-board-game';
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

export default Chess;