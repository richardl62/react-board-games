import { PublicPlayerMetadata } from '@shared/lobby/types';
import { WsRematchRequest } from '@shared/ws-rematch-request';
import { useSearchParamData } from '@/url-tools';
import { sAssert } from '@shared/utils/assert';
import { JSX } from 'react';
import styled from 'styled-components';

const OuterDiv = styled.div`
  margin-bottom: 0.5rem;

  button {
    margin-left: 0.3rem;
  }
`;

// A rematch is a restart of the match with the same players. Any player can propose
// one, and the match is restarted once all players want a rematch.
interface RematchControlsProps {
  // Should be the server's (rather than an optimistically predicted) player data.
  playerData: PublicPlayerMetadata[];
  playerID: string;
  sendRematchRequest: (request: WsRematchRequest) => void;
}

// Rematch control for the game controls area. Always shows something, i.e. a button
// to propose or withdraw a rematch, or a message explaining why neither is available.
export function RematchGameControl({
  playerData,
  playerID,
  sendRematchRequest,
}: RematchControlsProps): JSX.Element {
  const { seed: seedParam } = useSearchParamData();

  const allJoined = playerData.every((p) => p.name !== null);
  if (!allJoined) {
    return <span>Waiting for players to join</span>;
  }

  const proposalPending = playerData.some((p) => p.wantsRematch);
  if (!proposalPending) {
    const propose = () => {
      // As for a new match, use a fresh seed unless one has been explicitly set.
      sendRematchRequest({ rematch: 'propose', randomSeed: seedParam ?? Math.random() });
    };
    return <button onClick={propose}>Propose Rematch</button>;
  }

  if (viewerWantsRematch(playerData, playerID)) {
    return (
      <button onClick={() => sendRematchRequest({ rematch: 'decline' })}>Withdraw Rematch</button>
    );
  }

  // Accept and decline options are shown with the proposal status above the board.
  return <span>Rematch proposed</span>;
}

// Status of a pending rematch proposal, with options to accept or decline if the
// viewer has not yet accepted. Shown only when a rematch proposal is pending.
export function RematchProposal({
  playerData,
  playerID,
  sendRematchRequest,
}: RematchControlsProps): JSX.Element | null {
  const wanting = playerData.filter((p) => p.wantsRematch);
  const notWanting = playerData.filter((p) => !p.wantsRematch);
  const names = (players: PublicPlayerMetadata[]) => players.map((p) => p.name).join(', ');

  if (wanting.length === 0) {
    return null;
  }

  if (viewerWantsRematch(playerData, playerID)) {
    return (
      <OuterDiv>
        <span>{`Rematch proposed: waiting for ${names(notWanting)}`}</span>
      </OuterDiv>
    );
  }

  return (
    <OuterDiv>
      <span>{`Rematch proposed by ${names(wanting)}`}</span>
      <button onClick={() => sendRematchRequest({ rematch: 'accept' })}>Accept</button>
      <button onClick={() => sendRematchRequest({ rematch: 'decline' })}>Decline</button>
    </OuterDiv>
  );
}

function viewerWantsRematch(playerData: PublicPlayerMetadata[], playerID: string): boolean {
  const viewer = playerData.find((p) => p.id === playerID);
  sAssert(viewer, `Player ${playerID} not found in player data`);
  return viewer.wantsRematch === true;
}
