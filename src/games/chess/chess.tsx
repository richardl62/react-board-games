import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { 
  Board, ClickDrag, makeBoardProps, MoveFunctions, SquareID, squareSize 
} from '../../boards';
import { makeSimpleName } from '../../game-support';
import { map2DArray } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';
import { Piece } from "./piece";

type G = Array<Array<string|null>>;

const Square = styled.div`
  width: ${squareSize};
  height: ${squareSize};
`
const moveFunctions: Required<MoveFunctions> = {
  onClick: (square: SquareID) => {
    console.log('onClick', square);
  },

  onMoveStart: (square: SquareID) => {
    console.log('onMoveStart', square);
  },

  onMoveEnd: (from: SquareID, to: SquareID | null) => {
    console.log('onMoveEnd', from, to);
  },

  allowDrag: (from: SquareID) => true,

};

function MainBoard(props: Bgio.BoardProps<G>) {
  
  const pieces = map2DArray(props.G, name => {
     const p = name &&  <Piece pieceName={name}/>;
     return <Square> {p} </Square>;
  });

  const clickDrag = useRef(new ClickDrag(moveFunctions)).current;
  const boardProps = makeBoardProps(pieces, 'checkered', clickDrag);

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

function chess(displayName: string, pieces: G) : AppGame {
  return {
    name: makeSimpleName(displayName),
    displayName: displayName,

    minPlayers: 1,
    maxPlayers: 1, //TEMPORARY
    setup: () => pieces,
   
    moves: [],
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
