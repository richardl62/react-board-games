// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinition } from '../interfaces';
import RenderPiece from './chess-piece';

function chess(name: string, pieces: GameDefinition['pieces']): GameDefinition {
  return {
    name: name,
    gameType: 'chess',

    renderPiece: RenderPiece,
  
    boardStyle: {
      checkered: true,
      labels: true,
    },

    pieces: pieces,

    offBoardPieces: {
      top: ['p', 'n', 'b', 'r', 'q', 'k'],
      bottom: ['P', 'N', 'B', 'R', 'Q', 'K'],
    },
  };
}

const games = [
  chess(
    "chess",
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

  chess(
    "chess 5-a-side",
    [
      ['r', 'n', 'b', 'q', 'k'],
      ['p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null],
      [null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K'],
    ]
  ),
]

export default games;