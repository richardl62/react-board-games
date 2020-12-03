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
  
      pieces: pieces,
  
      copyable: {
        top: ['p', 'n',  'b',  'r',  'q',  'k'],
        bottom: ['P', 'N',  'B',  'R',  'Q',  'K' ],
      },

      borderLabels: true,
  
      makePiece: (name: string) => (<ChessPiece piece={name} />),
    };
  
    return <BoardGame options={options} />
  }

export default Chess;