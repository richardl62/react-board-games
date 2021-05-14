import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { RectangularBoard } from '../../game-support';
import { colors } from '../../game-support/colors';
import { RectangularBoardElememt } from '../../game-support/rectangular-board';
import { AppGame, BoardProps } from '../../shared/types';

interface G {
  values: Array<Array<number>>;
};

const initialValues = [
  [1, 2, 3],
  [7, 8, 9],
];

const GridHolder=styled.div`
  display: inline-block;
  border: 5px purple solid;
  margin: 3px;
`;

const Piece = styled.div`
  width: 50px;
  height: 50px;

  font-size: 40px; // KLUDGE

  text-align: center;
  margin: auto;
`

function squareColor(row: number, col: number, checkered: boolean) {
  if (!checkered) {
    return colors.whiteSquare;
  }

  const asTopLeft = (row + col) % 2 === 0;
  return asTopLeft ? colors.whiteSquare : colors.blackSquare;
}

type Label = [number, number];

function makeSquares(G: G, { checkered }: { checkered: boolean }) {
  const nRows = G.values.length;
  const nCols = G.values[0].length;


    let result = [];
    for (let rn = 0; rn < nRows; ++rn) {
      const row = [];

      for (let cn = 0; cn < nCols; ++cn) {;
        const onClick = (sq: Label) => console.log('clicked', sq);
        const onDrop = (sq: Label) => console.log('dragged', sq);
        const val = G.values[rn][cn];

        const elem: RectangularBoardElememt<Label> = {
            key: JSON.stringify([rn, cn]),
            backgroundColor: squareColor(rn, cn, checkered),
            // showHover: cn === 0 ? true : cn === 1 ? "black" : false,
            // highlight: cn === 0 && rn === 0,
            label: [rn,cn],
            onClick: onClick,
            onDrop: onDrop,
            piece: <Piece>{val}</Piece>,
  
        };
        row.push(elem);
      }

      result.push(row);
    }

    return result;
}

export const dummy: AppGame = {
  name: 'dummy',
  displayName: 'Dummy',

  setup: (): G => { return { values: initialValues }; },

  minPlayers: 1,
  maxPlayers: 1,

  moves: {
    add1: (G: G, ctx: any, row: number, col: number) => {
      let newValues = G.values.map(r => [...r]);
      newValues[row][col] += 1;
      return newValues;
    },
  },

  board: ({ G, moves, events }: BoardProps<G>) => (
    <DndProvider backend={HTML5Backend}>
      <GridHolder>
        <RectangularBoard<Label> pieces={makeSquares(G, { checkered: true })} />
      </GridHolder>
    </DndProvider>
  ),

}
