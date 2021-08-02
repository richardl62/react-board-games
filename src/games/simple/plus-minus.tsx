import React from 'react';
import { Ctx } from "boardgame.io";
import { GameWarnings } from '../../game-support/show-warning';
import { AppGame, BoardProps } from '../../shared/types';
import styled from 'styled-components';

interface G {
  value: number;
};

const Name = styled.span<{toPlay: boolean}>`
  text-decoration: ${props => props.toPlay ? 'underline' : 'none'}
` 
function PlayerData(props: BoardProps<G>) {
  const playerSpan = (id: string) => {
    const {status, name} = props.playerData[id];
    const isActive = id === props.playerID;
    const toPlay = id===props.ctx.currentPlayer;

    return (
      <span key={name}>
        <Name toPlay={toPlay}>
          {name + (isActive? " (you)" : "")}
        </Name>
        <span>
          {(status !== 'ready') && ` (${status})`}
          {' - '}
        </span>
      </span>
    )
  }

  return <div>
    {props.ctx.playOrder.map(playerSpan)}
  </div>
}

function Board(props: BoardProps<G>) {
  const { G, moves, events } = props
  return (
    <div>
      <PlayerData {...props} />
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
