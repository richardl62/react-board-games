// Use of GameDefinitionInput is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinitionInput } from './control/definition'
import RenderPiece from './chess-piece';

function chess(name: string, pieces: Array<Array<string|null>>): GameDefinitionInput {
  return {
    displayName: name,

    minPlayers: 2,
    maxPlayers: 2,

    renderPiece: RenderPiece,
  
    boardStyle: {
      checkered: true,
      labels: true,
    },

    initialState: {
      pieces: pieces,
    },

    offBoardPieces: {
      top: ['p', 'n', 'b', 'r', 'q', 'k'],
      bottom: ['P', 'N', 'B', 'R', 'Q', 'K'],
    },
  };
}

const games = [
  chess(
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

  chess(
    "Chess 5-a-Side",
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