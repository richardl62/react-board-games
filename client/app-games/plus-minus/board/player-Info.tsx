import { JSX } from 'react';
import { useMatchState } from '../match-state';
import styled from 'styled-components';

const PlayerInfoDiv = styled.span<{ isCurrent: boolean }>`
  margin-right: 1em;
  text-decoration: ${(props) => (props.isCurrent ? 'underline' : 'none')};
`;

export function PlayerInfo(): JSX.Element {
  const {
    G,
    viewingPlayer,
    ctx: { playOrder, currentPlayer },
    getPlayerName,
  } = useMatchState();

  const playerInfo = (id: string) => {
    const count = G.playerCount[id];
    let text = `${getPlayerName(id)}:${count}`;
    if (id === viewingPlayer) {
      text += ' (you)';
    }
    return (
      <PlayerInfoDiv key={id} isCurrent={id === currentPlayer}>
        {text}
      </PlayerInfoDiv>
    );
  };
  return <div>{playOrder.map((id) => playerInfo(id))}</div>;
}
