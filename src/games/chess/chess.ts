import { makeAppGridGame } from '../../layout/grid-based-board/make-app-grid-game';
import { chessInput } from './chess-input';

// Use 'require' as 'react-chess-pieces' does not contian type info
const ChessPieceImported = require('react-chess-pieces').default;

function chessPiece({ pieceName }: {pieceName: string}) {
    return ChessPieceImported({piece:pieceName});
}

const games = chessInput.map(input => {
  const boardStyle = {
      checkered: true,
      labels: true,
  };

  return makeAppGridGame(input, boardStyle, chessPiece);
});

export default games;