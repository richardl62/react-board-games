import { StartingPieces, GridGameInput } from "../../layout/grid-based-board/make-basic-grid-game";

function chess(name: string, displayName: string, pieces: StartingPieces) : GridGameInput {
  return ({
    name: name,
    displayName: displayName,

    minPlayers: 1,
    maxPlayers: 2,
    startingPieces: pieces,
   
    offBoardPieces: {
      top: ['p', 'n', 'b', 'r', 'q', 'k'],
      bottom: ['P', 'N', 'B', 'R', 'Q', 'K'],
    },
  });
}

const gamesInput = [
  chess(
    "chess",
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
    "chess5aside",
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

export  { gamesInput };
