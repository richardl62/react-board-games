import React from 'react';
import { BoardGrid } from '../../game-support/grid-based-board/grid-based-board';
import { AppGame, BoardProps } from '../../shared/types';

interface G {
  values: Array<Array<number>>;
};

const initialValues = [
  [1,2,3],
  [7,8,9],
];
console.log("initialValues", initialValues);

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
    console.log("G.values", G.values, G.values[0][0]);

    const squares = [];
    for(let rn = 0; rn < nRows; ++rn) {
      const row = [];
 
      for(let cn = 0; cn < nCols; ++cn) {
        const message = `hello from ${rn}:${cn}`;
        const onClick = ()=>alert(message);
        const val = G.values[rn][cn];

        row.push(<div onClick={onClick}>{val}</div>);
      }

      squares.push(row);
    }
    console.log("squares", squares);
  
    return <BoardGrid squares={squares} borderLabels={false} checkered={false} flip={false}/>
  },
}
