import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { MoveEnabledBoard, Element } from '../../boards/move-enabled';
import { map2DArray } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';
import { checkeredColor } from '../../boards';

interface RowCol {
  row: number;
  col: number;
}

interface SquareProps {
  moveStart: boolean;
}

const Square = styled.div<SquareProps>`
  width: 50px;
  height: 50px;

  font-size: 40px; // KLUDGE

  text-align: center;
  margin: auto;
`;

export interface SquareDef extends SquareProps {
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
  return { value: value, moveStart: false };
}

const BoardHolder = styled.div`
  display: inline-block;
  border: 5px purple solid;
  margin: 3px;
`;

function SwapSquares({ G, moves, events, reset }: Bgio.BoardProps<G>) {
  const onReset = () => {
    moves.reset();
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <BoardHolder>
          <MoveEnabledBoard
            elements={makeSquares(G, { checkered: true })}
            id={'dummy-game'}

            onMoveStart={moves.start}
            onMoveEnd={moves.end}
            onClick={()=>console.log("square clicked")}
          />
        </BoardHolder>
      </div>

      <button type='button' onClick={onReset}>Reset</button>
    </DndProvider>
  )
}

function makeSquares(G: G, { checkered }: { checkered: boolean }) {
  const nRows = G.squares.length;
  const nCols = G.squares[0].length;


  let result = [];
  for (let rn = 0; rn < nRows; ++rn) {
    const row = [];

    for (let cn = 0; cn < nCols; ++cn) {
      const sq = G.squares[rn][cn];

      const elem: Element = {
        backgroundColor: checkeredColor(rn, cn, sq),
        showHover: true,
        piece: <Square {...sq}>{sq.value}</Square>,

      };
      row.push(elem);
    }

    result.push(row);
  }

  return result;
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
    start: (G: G, ctx: any, sq: RowCol) => {
      G.squares[sq.row][sq.col].moveStart = true;
    },

    end: (G: G, ctx: any, from: RowCol, to: RowCol | null) => {
      G.squares[from.row][from.col].moveStart = false;
      if (to) {
        const tmp = G.squares[to.row][to.col];
        G.squares[to.row][to.col] = G.squares[from.row][from.col];
        G.squares[from.row][from.col] = tmp;
      }
    },

    // Using the BGIO supplied reset function lead to server errros.
    // TO DO: Understand why this happened;
    reset: (G: G, ctx: any) => {
      for(let row = 0; row < G.squares.length; ++row) {
        for(let col = 0; col < G.squares[row].length; ++col) {
          G.squares[row][col].moveStart=false;
          G.squares[row][col].value = initialValues[row][col];
        }
      }
    },
  },

  board: SwapSquares,

}

