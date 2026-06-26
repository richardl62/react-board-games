import { JSX } from 'react';
import { useMatchState } from '../match-state';
import styled from 'styled-components';

const PlayerInfoDiv = styled.span<{ isCurrent: boolean }>`
  margin-right: 1em;
  text-decoration: ${(props) => (props.isCurrent ? 'underline' : 'none')};
`;

interface PlayerGameData {
  count: number;
}

export function PlayerInfo(): JSX.Element {
  const {
    matchStatus: { playerData },
    viewingPlayer,
    ctx: { playOrder, currentPlayer },
    getPlayerName,
  } = useMatchState();

  const playerInfo = (id: string) => {
    const count =
      (playerData.find((p: { id: string }) => p.id === id)?.gameData as PlayerGameData | undefined)
        ?.count ?? 0;
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
