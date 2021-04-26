import { gamesInput } from './chess-input';
import { ChessPiece } from '../tools/chess-piece';
import { GridGameInput } from '../tools/grid-based/make-basic-grid-game';
import { makeAppGridGame } from '../tools/grid-based/make-app-grid-game';

function makeChessAppGame(input: GridGameInput) {
  const boardStyle = {
    checkered: true,
    labels: true,
  };

  return makeAppGridGame(input, ChessPiece, boardStyle);
}

const games = gamesInput.map(makeChessAppGame);
export default games;