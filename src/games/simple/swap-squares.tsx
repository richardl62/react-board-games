import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import {
  Board, ClickDragState, makeBoardProps, makeOnFunctions,
  MoveFunctions, SquareID, squareSize
} from '../../boards';
import { map2DArray, sameJSON } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';

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
    onClick: () => console.log("square clicked"),
  }
  const clickDragState = useRef(new ClickDragState()).current;

  const elements = map2DArray(G.squares, sq =>
    <Square {...sq}>{sq.value}</Square>,
  );

  const boardProps = makeBoardProps(elements, 'checkered', 
    'swapSquares',
    makeOnFunctions(moveFunctions, clickDragState), 
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
    const intialSquares = map2DArray(initialValues, makeSquareDef);
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

