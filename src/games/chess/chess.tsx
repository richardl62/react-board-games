import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Board,  makeBoardProps, MoveFunctions, SquareID,
  ClickDragState, makeOnFunctions, 
} from '../../boards';
import { makeSimpleName } from '../../game-support';
import assert from '../../shared/assert';
import { map2DArray, sameJSON } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';
import { Piece } from "./piece";

type Pieces = Array<Array<string|null>>;
type G = {
  pieces: Pieces,
  moveStart: SquareID | null,
}


function MainBoard({ G, moves }: Bgio.BoardProps<G>) {
  console.log("MainBoard: G.pieces[0][0]", G.pieces[0][0])
  const pieces = map2DArray(G.pieces, name =>
      name && <Piece pieceName={name}/>
    );

  const moveFunctions: MoveFunctions = {
    onClick: (square: SquareID) => {
      console.log('onClick', square);
    },
  
    onMoveStart: (sq: SquareID) => {
      const canMove = G.pieces[sq.row][sq.col] !== null;
      if(canMove) {
        moves.start(sq);
      }
      return canMove;
    },

    onMoveEnd: moves.end,
  };

  const clickDragState = useRef(new ClickDragState()).current;
  
  const boardProps = makeBoardProps(pieces, 'checkered', 
    makeOnFunctions(moveFunctions, clickDragState), 
    clickDragState.start);

  return (<DndProvider backend={HTML5Backend}>
      <Board {...boardProps} />
    </DndProvider>)
}

function ChessBoard(props: Bgio.BoardProps<G>) {
  return (
    <div>
      <MainBoard {...props} />
    </div>
  )
}

function chess(displayName: string, pieces: Pieces) : AppGame {
  return {
    name: makeSimpleName(displayName),
    displayName: displayName,

    minPlayers: 1,
    maxPlayers: 1, //TEMPORARY
    setup: () : G => {
      return {
        pieces: pieces,
        moveStart: null,
      }
    },
   
    moves: {
      start: (G: G, ctx: any, sq: SquareID) => {
          assert(G.pieces[sq.row][sq.col] !== null);
          G.moveStart = sq;
      },

      end: (G: G, ctx: any, from: SquareID, to: SquareID | null) => {
        assert(sameJSON(G.moveStart, from));
        if (to) {
          G.pieces[to.row][to.col] = G.pieces[from.row][from.col];
          G.pieces[from.row][from.col] = null;
        }
        G.moveStart = null;
      },
    },
    // offBoardPieces: {
    //   top: ['p', 'n', 'b', 'r', 'q', 'k'],
    //   bottom: ['P', 'N', 'B', 'R', 'Q', 'K'],
    // },

    board: ChessBoard
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
