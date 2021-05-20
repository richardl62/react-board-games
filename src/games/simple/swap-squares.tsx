import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { colors } from '../../boards';
import { DebugBoard, Element } from '../../boards/move-enabled';
import { map2DArray } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';

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

interface SquareDef extends SquareProps {
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

function makeSquareDef(value: number) : SquareDef {
  return {value:value, moveStart:false};
}

const GridHolder=styled.div`
  display: inline-block;
  border: 5px purple solid;
  margin: 3px;
`;



function squareColor(row: number, col: number, sq: SquareDef, checkered: boolean) {
  if(sq.moveStart) {
    return 'gold';
  }

  if (!checkered) {
    return colors.whiteSquare;
  }

  const asTopLeft = (row + col) % 2 === 0;
  return asTopLeft ? colors.whiteSquare : colors.blackSquare;
}

function makeSquares(G: G, { checkered }: { checkered: boolean }) {
  const nRows = G.squares.length;
  const nCols = G.squares[0].length;


    let result = [];
    for (let rn = 0; rn < nRows; ++rn) {
      const row = [];

      for (let cn = 0; cn < nCols; ++cn) {;
        const sq = G.squares[rn][cn];

        const elem: Element = {
            backgroundColor: squareColor(rn, cn, sq, checkered),
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
  displayName: 'Swap Squares (test)',

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
      if(to) {
        const tmp = G.squares[to.row][to.col];
        G.squares[to.row][to.col] = G.squares[from.row][from.col];
        G.squares[from.row][from.col] = tmp;
      }
      /* let newValues = G.squares.map(r => [...r]);
      newValues[from.row][from.col].moveStart = false;
      if(to) {
        newValues[to.row][to.col].moveEnd = true;
      }
      return newValues; */
    },
  },

  board: ({ G, moves, events }: Bgio.BoardProps<G>) => (
    <DndProvider backend={HTML5Backend}>
      <GridHolder>
        <DebugBoard
          elements={makeSquares(G, { checkered: true })} 
          id={'dummy-game'}
 
          onMoveStart={moves.start}
          onMoveEnd={moves.end}
          />
      </GridHolder>
    </DndProvider>
  ),

}

