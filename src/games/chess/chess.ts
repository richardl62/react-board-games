import { gamesInput } from './chess-input';
import { GridGameInput } from '../tools/grid-based/make-basic-grid-game';
import { makeAppGridGame } from '../tools/grid-based/make-app-grid-game';

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