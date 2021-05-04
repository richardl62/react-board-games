import React from 'react';
import { AppGame, BoardProps } from '../../shared/types';

interface G {
  value: number;
};

const plusminus : AppGame = {
  name: 'plusminus',
  displayName: 'Plus Minus (for testing)',

  setup: (): G => { return { value: 0 }; },

  minPlayers: 1,
  maxPlayers: 100,

  moves: {
    add: (G: G, ctx: any, value: number) => {
      G.value += value;
    },
  },

  board: ({ G, moves, events }: BoardProps<G> ) => {
    return (
      <div>
        <button type="button" onClick={(() => moves.add(1))}>+1</button>
        <button type="button" onClick={(() => moves.add(-1))}>-1</button>
        <button type="button" onClick={() => events.endTurn!()}>End Turn</button>
        <div>{G.value}</div>
      </div>
    )
  },
}

const games = [ plusminus ];

export default games;