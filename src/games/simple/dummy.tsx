import React from 'react';
import styled from 'styled-components';
import { GridBased } from '../../game-support';
import { colors } from '../../game-support/colors';
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
`;

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

  board: ({ G, moves, events }: BoardProps<G>) => {
    const nRows = G.values.length;
    const nCols = G.values[0].length;

    const squares = ({ checkered }: { checkered: boolean }) => {
      let result = [];
      for (let rn = 0; rn < nRows; ++rn) {
        const row = [];

        for (let cn = 0; cn < nCols; ++cn) {
          const message = `hello from ${rn}:${cn}`;
          const onClick = () => alert(message);
          const val = G.values[rn][cn];

          row.push(
            <GridBased.Square onClick={onClick} color={squareColor(rn, cn, checkered)}>
              <Piece>{val}</Piece>
            </GridBased.Square>);
        }

        result.push(row);
      }

      return result;

    }
    return (<div>
      <GridHolder>
        <GridBased.Board squares={squares({checkered:true})} reverseRows={false}
          borderLabels={true}
          gridGap={'0'} borderWidth={'20px'}/>
      </GridHolder>

      <GridHolder>
        <GridBased.Board squares={squares({checkered:false})} reverseRows={false}
          borderLabels={false}
          gridGap={'1%'} borderWidth={'20px'}/>
      </GridHolder>


    </div>);
  },
}
