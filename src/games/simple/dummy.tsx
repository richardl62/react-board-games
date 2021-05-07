import React from 'react';
import styled from 'styled-components';
import { GridBased } from '../../game-support';
import { colors } from '../../game-support/colors';
import { AppGame, BoardProps } from '../../shared/types';

interface G {
  values: Array<Array<number>>;
};

const initialValues = [
  [1,2,3],
  [7,8,9],
];

const Piece = styled.div`
  width: 100%;
  height: 100%;
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

export const dummy : AppGame = {
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

  board: ({ G, moves, events }: BoardProps<G> ) => {
    const nRows = G.values.length;
    const nCols = G.values[0].length;
    const checkered = true;


    const squares = [];
    for(let rn = 0; rn < nRows; ++rn) {
      const row = [];
 
      for(let cn = 0; cn < nCols; ++cn) {
        const message = `hello from ${rn}:${cn}`;
        const onClick = ()=>alert(message);
        const val = G.values[rn][cn];

        row.push(
          <GridBased.Square onClick={onClick} color={squareColor(rn,cn, checkered)}>
            <Piece>{val}</Piece>
          </GridBased.Square>);
      }

      squares.push(row);
    }
  
    return <GridBased.Board squares={squares} borderLabels={true} reverseRows={false}
     internalBorders={!checkered}/>
  },
}
