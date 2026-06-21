import { JSX } from 'react';
import styled from 'styled-components';
import { useMatchState } from '../match-state';
import { PlayerInfo } from './player-Info';

const ButtonArea = styled.div`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;

  > button {
    width: 2em;
  }

  > :first-child {
    width: 6em;
  }

  > :last-child {
    margin-left: 0.5em;
  }
`;

function Board(): JSX.Element {
  const context = useMatchState();
  const {
    G: { sharedCount: count, lastSnap },
    moves,
    events,
  } = context;

  return (
    <div>
      <PlayerInfo />

      <ButtonArea>
        <ButtonRow>
          <div>Player Count </div>
          <button onClick={() => moves.addPlayerCount(1)}>+1</button>
          <button onClick={() => moves.addPlayerCount(-1)}>-1</button>
          <div> Last snap: {lastSnap}</div>
        </ButtonRow>

        <ButtonRow>
          <div>Shared Count </div>
          <button onClick={() => moves.addSharedCount(1)}>+1</button>
          <button onClick={() => moves.addSharedCount(-1)}>-1</button>
          <div>{count}</div>
        </ButtonRow>
      </ButtonArea>

      <div>
        <button onClick={() => events.endTurn()}>End Turn</button>
      </div>
    </div>
  );
}

export default Board;
