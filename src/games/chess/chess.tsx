import React from 'react';
import { makeSimpleName } from '../../game-support';
import { AppGame, Bgio } from '../../shared/types';
import { Board, Element as BoardElement } from '../../boards/move-enabled';
import { map2DArray } from '../../shared/tools';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { Piece } from "./piece";

const StyledSquare = styled.div`
  height: 50px;
  width: 50px;
`

function Square({pieceName} : {pieceName : string | null}) {
  return <StyledSquare>{pieceName && <Piece pieceName={pieceName}/>} </StyledSquare>
}

type G = Array<Array<string|null>>;

function MainBoard(props: Bgio.BoardProps<G>) {
  const elements = map2DArray(props.G, 
      (name: string | null) : BoardElement => {
        return {piece: <Square pieceName={name} />}
      }
  );

  return (<DndProvider backend={HTML5Backend}>
      <Board elements={elements} />
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
