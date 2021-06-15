import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { 
  Board, ClickDrag, makeBoardProps, MoveFunctions, SquareID, squareSize 
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

const Square = styled.div`
  width: ${squareSize};
  height: ${squareSize};
`

function MainBoard({ G, moves }: Bgio.BoardProps<G>) {
  
  const pieces = map2DArray(G.pieces, name => {
     const p = name &&  <Piece pieceName={name}/>;
     return <Square> {p} </Square>;
  });

  const moveFunctions: Required<MoveFunctions> = {
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

    allowDrag(sq: SquareID) {
      return G.pieces[sq.row][sq.col] !== null;
    }
  };

  const clickDrag = useRef(new ClickDrag(moveFunctions)).current;
  console.log('clickDrag.start', clickDrag.start);
  const boardProps = makeBoardProps(pieces, 'checkered', 
    clickDrag.basicOnFunctions(), clickDrag.start);

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
