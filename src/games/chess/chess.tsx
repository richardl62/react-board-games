import { checkered } from '../../simple-board-game';
import { Chess as ChessPiece } from '../pieces';

type PieceArray = Array<Array<string | null>>;

function chess(name: string, pieces: PieceArray) {
    return {
      displayName: name,

      style: checkered,
      borderLabels: true,
  
      pieces: pieces,

      copyablePieces: {
        top: ['p', 'n',  'b',  'r',  'q',  'k'],
        bottom: ['P', 'N',  'B',  'R',  'Q',  'K' ],
      },
  
      makePiece: (name: string) => (<ChessPiece piece={name} />),
    };
  }

const games = {
  chess: chess(
    "Chess",
    [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ]
  ),

  chess5ASide: chess(
    "Chess 5-a-side",
    [
      ['r', 'n', 'b', 'q', 'k'],
      ['p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null],
      [null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K'],
    ]
  ),
}

export default games;
