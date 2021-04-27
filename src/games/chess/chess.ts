import { makeAppGridGame } from '../../layout/grid-based-board/make-app-grid-game';
import { GridGameInput } from '../../layout/grid-based-board/make-basic-grid-game';
import { gamesInput } from './chess-input';

// Use 'require' as 'react-chess-pieces' does not contian type info
const ChessPieceImported = require('react-chess-pieces').default;

function chessPiece({ pieceName }: {pieceName: string}) {
    return ChessPieceImported({piece:pieceName});
}
function makeChessAppGame(input: GridGameInput) {
  const boardStyle = {
    checkered: true,
    labels: true,
  };

  return makeAppGridGame(input, chessPiece, boardStyle);
}

const games = gamesInput.map(makeChessAppGame);
export default games;