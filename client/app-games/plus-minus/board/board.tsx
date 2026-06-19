import { JSX } from 'react';
import styled from 'styled-components';
import { standardOuterMargin } from '../../../app-game-support/styles';
import { useMatchState } from '../match-state';

const OuterDiv = styled.div`
  margin: ${standardOuterMargin};
`;

const PlayerInfoDiv = styled.span`
  margin-right: 1em;
`;

const CurrentPlayer = styled.div`
  margin-top: 0.7em;
  margin-bottom: 0.3em;
`;

function PlayerInfo(): JSX.Element {
  const {
    G,
    viewingPlayer,
    ctx: { playOrder },
    getPlayerName,
  } = useMatchState();

  const name = (id: string) => {
    const count = G.playerCount[id];
    return `${getPlayerName(id)}:${count} ${id === viewingPlayer ? ' (you)' : ''}`;
  };
  return (
    <div>
      {playOrder.map((id) => (
        <PlayerInfoDiv key={id}> {name(id)} </PlayerInfoDiv>
      ))}
    </div>
  );
}

function Board(): JSX.Element {
  const context = useMatchState();
  const {
    G: { sharedCount: count },
    moves,
    events,
    viewingPlayer,
    getPlayerName,
  } = context;

  const current = context.ctx.currentPlayer === viewingPlayer;
  const currentPlayerName = current ? 'You' : getPlayerName(context.ctx.currentPlayer);
  return (
    <OuterDiv>
      <PlayerInfo />

      <CurrentPlayer>Current player: {currentPlayerName}</CurrentPlayer>

      <button onClick={() => moves.addSharedCount(1)}>+1</button>

      <button onClick={() => moves.addSharedCount(-1)}>-1</button>

      <button onClick={() => events.endTurn()}>End Turn</button>

      <div>{count}</div>
      <div>
        <button onClick={() => moves.addPlayerCount(1)}>+1 (Player)</button>
      </div>
    </OuterDiv>
  );
}

export default Board;
