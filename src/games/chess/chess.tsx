import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import {
  Board, checkered, ClickDragState, DragType, makeBoardProps,
  squareInteractionFunc, MoveFunctions, SquareID, SquareInteractionFunc,
} from '../../boards';
import { makeSimpleName } from '../../game-support';
import assert from '../../shared/assert';
import { nestedArrayMap, sameJSON } from '../../shared/tools';
import { AppGame, BoardProps } from '../../shared/types';
import { Piece } from "./piece";

const squareSize = '50px';

const PlayArea = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: calc(${squareSize} * 0.1);
  align-items: center;
`
type Pieces = (string | null)[][];
type G = {
  pieces: Pieces,
  moveStart: SquareID | null,
}

const offBoardPieces = {
  black: ['p', 'n', 'b', 'r', 'q', 'k'],
  white: ['P', 'N', 'B', 'R', 'Q', 'K'],
};

const offBoard = (sq: SquareID) => sq.boardID !== 'main';


const offBoardPiece = (sq: SquareID): string => {
  //KLUDGE To avoid fighting with 
  assert(sq.boardID === 'white' || (sq.boardID === 'black'));
  assert(sq.row === 0);

  const offBoard = offBoardPieces[sq.boardID];
  return offBoard[sq.col];
}

interface OffBoardProps {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
  rowName: keyof typeof offBoardPieces;
}

function OffBoard({ squareInteraction, clickDragState, rowName }: OffBoardProps) {
  //const {G, moves} = bgioProps;
  const pieces = offBoardPieces[rowName];
  const boardPieces = pieces.map(name =>
    <Piece pieceName={name} />
  );

  const boardProps = makeBoardProps({
    pieces: [boardPieces],

    squareBackground: 'white',
    internalBorders: false,
    externalBorders: false,
    squareSize: squareSize,

    boardID: rowName,
    squareInteraction: squareInteraction,
    moveStart: clickDragState.start
  });

  return <Board {...boardProps} />
}

interface MainBoardProps {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
  pieces: (string | null)[][];
}

function MainBoard({ squareInteraction, clickDragState, pieces }: MainBoardProps) {

  const boardPieces = nestedArrayMap(pieces, name =>
    name && <Piece pieceName={name} />
  );

  const boardProps = makeBoardProps({
    pieces: boardPieces,

    squareBackground: checkered,
    externalBorders: 'labelled',
    internalBorders: false,
    squareSize: squareSize,

    boardID: 'main',
    squareInteraction,
    moveStart: clickDragState.start
  });
  boardProps.boardID = "main";

  return <Board {...boardProps} />
}

function ChessBoard(props: BoardProps<G>) {
  const { G, moves } = props;

  const clickDragState = useRef(new ClickDragState()).current;
  const moveFunctions: MoveFunctions = {

    onMoveStart: (sq: SquareID) => {
      const canMove = offBoard(sq) || G.pieces[sq.row][sq.col] !== null;
      if (canMove) {
        moves.start(sq);
      }
      return canMove;
    },

    onMoveEnd: moves.end,

    dragType: (sq: SquareID) => offBoard(sq) ? DragType.copy : DragType.move,
  };

  const squareInteraction = squareInteractionFunc(moveFunctions, clickDragState);

  return (
    <DndProvider backend={HTML5Backend}>
      <PlayArea>
        <OffBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          rowName='black'
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          pieces={G.pieces}
        />
        <OffBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          rowName='white'
        />
      </PlayArea>
    </DndProvider>
  )
}

function chess(displayName: string, pieces: Pieces): AppGame {
  return {
    name: makeSimpleName(displayName),
    displayName: displayName,

    minPlayers: 1,
    maxPlayers: 1, //TEMPORARY
    setup: (): G => {
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
        //assert(sameJSON(G.moveStart, from));

        if (to && !offBoard(to) && !sameJSON(to, from)) {
          if (offBoard(from)) {
            G.pieces[to.row][to.col] = offBoardPiece(from);
          } else {
            G.pieces[to.row][to.col] = G.pieces[from.row][from.col];
            G.pieces[from.row][from.col] = null;
          }
        }

      },
    },

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
