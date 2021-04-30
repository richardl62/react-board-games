import React from 'react';
import { BoardProps } from '../shared/types';
import styled from 'styled-components'

export const unnamedPlayer = '_Unnamed Player_';


const PlayerNames = styled.div`
  display: flex;
`;

interface PlayerNameProps {
  isCurrent: boolean;
}
const PlayerName = styled.div<PlayerNameProps>`
  margin-left: 1em;
  font-weight: bold;
  text-decoration: ${props => props.isCurrent ? "underline" : "default"};
`;

interface BoardAndPlayerProps extends BoardProps {
  children: React.ReactNode;
}
export function BoardAndPlayers(props: BoardAndPlayerProps) {
  const { ctx, matchData, children } = props;

  if (!matchData) {
    return <div>No player information found</div>;
  }

  const playerID = Number(props.playerID);
  const currentPlayer = Number(ctx.currentPlayer)
  if (!matchData[playerID] || !matchData[currentPlayer]) {
    throw new Error("Bad player index");
  }

  const playerElems = [];
  for (let index = 0; index < matchData.length; ++index) {
    const p = matchData[index];
    if (p.name) {
      let text: string;
      if (p.name === unnamedPlayer) {
        text = (index === playerID) ? 'You' : `Player ${p.id}`;
      } else {
        text = p.name;
      }

      if (!p.isConnected) {
        text += ' (Offline)';
      }

      playerElems.push(
        <PlayerName isCurrent={index === currentPlayer}>
          {text}
        </PlayerName>
      );
    }
  }

  const numToJoin = matchData.length - playerElems.length;
  return (
    <div>
      {playerElems.length === 1 ? null :
        <PlayerNames>
          <span>Players:</span>
          {playerElems}
        </PlayerNames>
      }
      {numToJoin === 0 ?
        <div>{children}</div> :
        <div>{`Waiting for ${numToJoin} more player(s) to join`}</div>
      }
    </div>);
}
