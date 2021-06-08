import React, { useRef } from 'react';
import { makeSimpleName } from '../../game-support';
import { AppGame, Bgio } from '../../shared/types';
import { Board } from '../../boards/basic';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Piece } from "./piece";
import { BoardProps, BoardElement } from '../../boards/basic';
import { makeCheckered } from '../../boards/basic/make-checkered';
import styled from 'styled-components';
import { MoveFunctions, SquareID, squareSize } from '../../boards';
import { addOnFunctions } from '../../boards/basic/add-on-functions';
import { ClickDrag } from '../../boards/basic/click-drag';

type G = Array<Array<string|null>>;

const Square = styled.div`
  width: ${squareSize};
  height: ${squareSize};
`
const moveFunctions: Required<MoveFunctions> = {
  onClick: (square: SquareID) => {
    //alert('onClick');
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
  
  const elements = props.G.map( row => row.map(
    (name) : BoardElement  => {
      return {
        piece: <Square>{name && <Piece pieceName={name}/>}</Square>,
      };
    }
  ));

  const boardProps : BoardProps = {
    elements: elements,
  }

  const clickDrag = useRef(new ClickDrag(moveFunctions)).current;

  addOnFunctions(boardProps, clickDrag.basicOnFunctions());
  makeCheckered(boardProps);

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
