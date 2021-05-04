import { StartingPieces, makeGridGameState, makeGridGame } from "../../grid-based-games";
import { Piece } from "./piece";

function chess(displayName: string, pieces: StartingPieces) {
  return makeGridGame({
    displayName: displayName,

    minPlayers: 1,
    maxPlayers: 2,
    setup: () => makeGridGameState(pieces),
   
    offBoardPieces: {
      top: ['p', 'n', 'b', 'r', 'q', 'k'],
      bottom: ['P', 'N', 'B', 'R', 'Q', 'K'],
    },

    boardStyle: {
      checkered: true,
      labels: true,
    },
    
    renderPiece: Piece,
  });
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
