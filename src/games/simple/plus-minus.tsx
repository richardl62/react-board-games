import React from 'react';
import { Ctx } from "boardgame.io";
import { GameWarnings } from '../../game-support/show-warning';
import { AppGame, BoardProps } from '../../shared/types';

interface G {
  value: number;
};


function Board(props: BoardProps<G>) {
  const { G, moves, events } = props


  const playerSpan = (id: string) => {
    const pd = props.playerData[id];
    <span key={pd.name}>{`${pd.name} ${pd.status} - `}</span>
  }

  function MatchData(props: BoardProps<G>) {
    // if(!props.matchData) {
    //   return <div>Match Data not available</div>
    // }

    return <div>{props.ctx.playOrder.map(playerSpan)}</div>
  }

  return (
    <div>
      <MatchData {...props} />
      <GameWarnings {...props} />
      {props.allJoined && (<div>
        <button type="button" onClick={(() => moves.add(1))}>+1</button>
        <button type="button" onClick={(() => moves.add(-1))}>-1</button>
        <button type="button" onClick={() => events.endTurn!()}>End Turn</button>
        <div>{G.value}</div>
      </div>)}
    </div>
    );
}

export const plusminus : AppGame = {
  name: 'plusminus',
  displayName: 'Plus Minus (for testing)',

  setup: (): G => { return { value: 0 }; },

  minPlayers: 1,
  maxPlayers: 100,

  moves: {
    add: (G: G, ctx: Ctx, value: number) => {
      G.value += value;
    },
  },

  board: Board,
}
