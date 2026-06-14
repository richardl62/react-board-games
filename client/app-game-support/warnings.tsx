import { JSX, useEffect, useState } from 'react';
import { useStandardBoardContext } from './standard-board';
import styled from 'styled-components';
import { getPlayerStatus } from './player-status';
import { PublicPlayerMetadata } from '@shared/lobby/types';
import { Ctx } from '@shared/game-control/ctx';
import { ConnectionStatus, describeClose } from '@/app/match-play/online/use-server-connection';

const WarningDiv = styled.div`
  span:first-child {
    color: darkred;
    font-weight: 600;
    margin-right: 0.2em;
  }
  margin-bottom: 0.2em;
`;

// Smooth a piece of warning text over time to avoid flicker:
// - when nothing is shown, a new warning is surfaced only once `text` has stayed
//   unchanged for `appearAfter` ms (0 = immediately), so brief transient issues
//   never appear;
// - once something is shown, any change (including clearing to null) is held off
//   until it has been displayed for at least `minVisible` ms.
function useSmoothedText(
  text: string | null,
  { appearAfter, minVisible }: { appearAfter: number; minVisible: number },
): string | null {
  const [stableText, setStableText] = useState<string | null>(text);
  const [lastChangeTime, setLastChangeTime] = useState<number>(Date.now());

  useEffect(() => {
    if (text === stableText) {
      return;
    }

    const commit = () => {
      setStableText(text);
      setLastChangeTime(Date.now());
    };

    // Nothing is shown yet: wait for `text` to persist `appearAfter` before
    // surfacing it (the effect re-runs, resetting this timer, if it changes again).
    if (stableText === null) {
      if (appearAfter === 0) {
        commit();
        return;
      }
      const handler = setTimeout(commit, appearAfter);
      return () => clearTimeout(handler);
    }

    // Something is already shown: keep it until it has been visible `minVisible`.
    const remaining = minVisible - (Date.now() - lastChangeTime);
    if (remaining > 0) {
      const handler = setTimeout(commit, remaining);
      return () => clearTimeout(handler);
    }

    commit();
  }, [text, stableText, lastChangeTime, appearAfter, minVisible]);

  return stableText;
}

function connectionIssueDescription(
  connectionStatus: ConnectionStatus,
  waitingForServer: boolean,
): string | null {
  if (connectionStatus === 'connected') {
    return waitingForServer ? 'Waiting for server...' : null;
  } else if (connectionStatus === 'connecting') {
    return 'Connecting to server...';
  } else {
    const reason = describeClose(connectionStatus.closeEvent);
    let connectionIssue = `No connection to server (${reason})`;
    if (connectionStatus.reconnecting) {
      connectionIssue += ': attempting reconnection ...';
    } else if (waitingForServer) {
      // Reconnection has been abandoned while actions are still pending. Those
      // actions are shown optimistically but were never confirmed by the server,
      // so warn the player rather than leaving them looking applied.
      connectionIssue += '. Recent moves may not have been fully processed.';
    }
    return connectionIssue;
  }
}

// If any players are disconnected return a string that names them. Or return null
// if all players are connected.
function playersWarning(playerData: PublicPlayerMetadata[], ctx: Ctx): string | null {
  const disconnectedPlayers: string[] = [];
  for (const pid of ctx.playOrder) {
    const status = getPlayerStatus(playerData, pid);

    // Warn only about players that have joined but are not now connected
    if (status.connectionStatus === 'not connected') {
      disconnectedPlayers.push(status.name);
    }
  }

  if (disconnectedPlayers.length === 0) {
    return null;
  }
  return `${disconnectedPlayers.join(', ')} ${disconnectedPlayers.length === 1 ? 'is' : 'are'} not connected.`;
}

function Warning({
  text,
  appearAfter,
  minVisible,
}: {
  text: string | null;
  appearAfter: number;
  minVisible: number;
}): JSX.Element {
  const stableText = useSmoothedText(text, { appearAfter, minVisible });
  if (!stableText) {
    return <></>;
  }
  return (
    <WarningDiv>
      <span>WARNING: </span>
      <span>{stableText}</span>
    </WarningDiv>
  );
}

// Display warning about connections to the server or unexpected errors.
// (Individual games should handle warnings about game-specific issues
// such as illegal moves.)
export function Warnings(): JSX.Element {
  // Connection/player warnings cover possibly-transient network issues, so wait
  // before showing them; once shown (and for the immediate warnings below), keep
  // any warning visible for at least minVisible to avoid flicker.
  const networkIssueWait = 2000;
  const minVisible = 2000;

  const { matchStatus, ctx } = useStandardBoardContext();
  const {
    connectionStatus,
    playerData,
    errorInLastAction,
    actionRequestStatus: { waitingForServer, lastActionUnconfirmed, predictionDiverged },
  } = matchStatus;

  const connectionWarning = connectionIssueDescription(connectionStatus, waitingForServer);
  const disconnectedPlayersWarning = playersWarning(playerData, ctx);
  const errorInActionWarning = errorInLastAction
    ? `Error in last action: ${errorInLastAction}`
    : null;
  const unconfirmedActionWarning = lastActionUnconfirmed
    ? 'Last action unconfirmed (possible network problem)'
    : null;
  const predictionDivergedWarning = predictionDiverged
    ? 'Unexpected server response (internal error)'
    : null;

  return (
    <div>
      <Warning text={connectionWarning} appearAfter={networkIssueWait} minVisible={minVisible} />
      <Warning
        text={disconnectedPlayersWarning}
        appearAfter={networkIssueWait}
        minVisible={minVisible}
      />
      <Warning text={errorInActionWarning} appearAfter={0} minVisible={minVisible} />
      <Warning text={unconfirmedActionWarning} appearAfter={0} minVisible={minVisible} />
      <Warning text={predictionDivergedWarning} appearAfter={0} minVisible={minVisible} />
    </div>
  );
}
