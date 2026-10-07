import { PublicPlayerMetadata } from '@shared/lobby/types';
import { WsRematchRequest } from '@shared/ws-rematch-request';
import { useSearchParamData } from '@/url-tools';
import { JSX } from 'react';
import styled from 'styled-components';

const OuterDiv = styled.div`
  margin-bottom: 0.5rem;

  button {
    margin-left: 0.3rem;
  }
`;

// Lets a player propose, accept or decline a rematch (i.e. a restart of the match
// with the same players). The match is restarted once all players want a rematch.
export function RematchControls({
  playerData,
  playerID,
  sendRematchRequest,
}: {
  // Should be the server's (rather than an optimistically predicted) player data.
  playerData: PublicPlayerMetadata[];
  playerID: string;
  sendRematchRequest: (request: WsRematchRequest) => void;
}): JSX.Element | null {
  const { seed: seedParam } = useSearchParamData();

  const allJoined = playerData.every((p) => p.name !== null);
  if (!allJoined) {
    return null;
  }

  const wanting = playerData.filter((p) => p.wantsRematch);
  const notWanting = playerData.filter((p) => !p.wantsRematch);
  const names = (players: PublicPlayerMetadata[]) => players.map((p) => p.name).join(', ');

  if (wanting.length === 0) {
    const propose = () => {
      // As for a new match, use a fresh seed unless one has been explicitly set.
      sendRematchRequest({ rematch: 'propose', randomSeed: seedParam ?? Math.random() });
    };
    return (
      <OuterDiv>
        <button onClick={propose}>Propose Rematch</button>
      </OuterDiv>
    );
  }

  const decline = () => sendRematchRequest({ rematch: 'decline' });

  const viewerWantsRematch = wanting.some((p) => p.id === playerID);
  if (viewerWantsRematch) {
    return (
      <OuterDiv>
        <span>{`Rematch proposed: waiting for ${names(notWanting)}`}</span>
        <button onClick={decline}>Withdraw</button>
      </OuterDiv>
    );
  }

  return (
    <OuterDiv>
      <span>{`Rematch proposed by ${names(wanting)}`}</span>
      <button onClick={() => sendRematchRequest({ rematch: 'accept' })}>Accept</button>
      <button onClick={decline}>Decline</button>
    </OuterDiv>
  );
}
