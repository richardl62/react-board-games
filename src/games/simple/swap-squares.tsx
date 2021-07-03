import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import {
  Board, ClickDragState, makeBoardProps, makeOfFunctions,
  MoveFunctions, SquareID, checkered, DragType
} from '../../boards';
import { nestedArrayMap, sameJSON } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';

const squareSize = '50px';

const Square = styled.div`
  font-size: calc(${squareSize} * 0.8); // KLUDGE
  text-align: center;
  margin: auto;
`;

export interface SquareDef {
  value: number;
}

interface G {
  squares: Array<Array<SquareDef>>;
};

const initialValues = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function makeSquareDef(value: number): SquareDef {
  return { value: value };
}

function SwapSquares({ G, moves, events, reset }: Bgio.BoardProps<G>) {
  const onReset = () => {
    moves.reset();
  }

  const moveFunctions : MoveFunctions = {
    onMoveStart: (sq: SquareID) => {
      moves.start(sq);
      return true;
    },
    onMoveEnd: moves.end,
    dragType: () => DragType.move, 
  }
  const clickDragState = useRef(new ClickDragState()).current;

  const elements = nestedArrayMap(G.squares, sq =>
    <Square {...sq}>{sq.value}</Square>,
  );

  const boardProps = makeBoardProps(
    elements, 
    {
      squareBackground: checkered,
      internalBorders: false,
      externalBorders: 'labelled',
      squareSize: squareSize,
    },
    'swapSquares',
    makeOfFunctions(moveFunctions, clickDragState), 
    clickDragState.start);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Board {...boardProps} />
      </div>

      <button type='button' onClick={onReset}>Reset</button>
    </DndProvider>
  )
}

export const swapSquares: AppGame = {
  name: 'swap-squares',
  displayName: 'Swap Squares (for testing)',

  setup: (): G => {
    const intialSquares = nestedArrayMap(initialValues, makeSquareDef);
    return { squares: intialSquares };
  },

  minPlayers: 1,
  maxPlayers: 1,

  moves: {
    start: (G: G, ctx: any, sq: SquareID) => {
    },

    end: (G: G, ctx: any, from: SquareID, to: SquareID | null) => {
      if (to && !sameJSON(from, to)) {
        const tmp = G.squares[to.row][to.col];
        G.squares[to.row][to.col] = G.squares[from.row][from.col];
        G.squares[from.row][from.col] = tmp;
      }
    },

    // Using the BGIO supplied reset function lead to server errros.
    // TO DO: Understand why this happened;
    reset: (G: G, ctx: any) => {
      for (let row = 0; row < G.squares.length; ++row) {
        for (let col = 0; col < G.squares[row].length; ++col) {
          G.squares[row][col].value = initialValues[row][col];
        }
      }
    },
  },

  board: SwapSquares,
}

