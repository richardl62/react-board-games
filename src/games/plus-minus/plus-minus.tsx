import React from 'react';
import { AppGame, BoardProps } from '../../shared/types';
import { G, plusminusInput } from './plus-minus-input';

if(plusminusInput.length !== 1) {
  throw new Error("Expected exactly one plus-minus game");
}

const plusminus : AppGame = {
  ...plusminusInput[0],
  
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