import { JSX } from 'react';
import { StandardMatchPlay } from './standard-match-play';
import { ConnectionStatus, useServerConnection } from './use-server-connection';
import { AppGame } from '@/app-game-support/app-game';
import { Player, MatchID } from '@/app-game-support/types';

// This together with OfflineMatch are the entry points used to start a match.
export function OnlineMatch({
  game,
  player,
  matchID,
}: {
  game: AppGame;
  player: Player;
  matchID: MatchID;
}): JSX.Element {
  const serverConnection = useServerConnection({ matchID, player });
  const { serverResponse, connectionStatus } = serverConnection;

  if (!serverResponse) {
    return <ShowConnectionStatus connectionStatus={connectionStatus} />;
  }

  return (
    <StandardMatchPlay
      game={game}
      player={player}
      serverConnection={{ ...serverConnection, serverResponse }}
    />
  );
}

// A simple component for use when there has not been a response from the server.
// (To Do: Try to think of a better name.)
function ShowConnectionStatus({
  connectionStatus,
}: {
  connectionStatus: ConnectionStatus;
}): JSX.Element {
  // If the status is 'connected' then assume we are waiting a response from the server
  // and to keep things simple, report this in the same way as when waiting to connect..
  if (connectionStatus === 'connecting' || connectionStatus === 'connected') {
    return <div>Connecting ...</div>;
  }

  const { reason, code } = connectionStatus.closeEvent;
  if (reason) {
    return <div>ERROR: Cannot join match ({reason})</div>;
  }

  return <div>ERROR: Cannot connect to server (code {code})</div>;
}
