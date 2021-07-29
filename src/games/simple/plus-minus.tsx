import React from 'react';
import { getPlayerData, PlayerData, playerStatus } from '../../game-support';
import { GameWarnings } from '../../game-support/show-warning';
import { AppGame, BoardProps } from '../../shared/types';

interface G {
  value: number;
};


function Board(props: BoardProps<G>) {
  const { G, moves, events } = props;

  const playerData = getPlayerData(props);
  const joined = playerStatus(props).joined;

  const playerSpan = (pd: PlayerData) => <span key={pd.name}>{`${pd.name} ${pd.status} - `}</span>;
  return (
    <div>
      <div>{playerData.map(playerSpan)}</div>
      <GameWarnings {...props} />
      {joined && (<div>
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
    add: (G: G, ctx: any, value: number) => {
      G.value += value;
    },
  },

  board: Board,
}
