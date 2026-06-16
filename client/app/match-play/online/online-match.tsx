import { JSX } from 'react';
import { ServerConnection, useServerConnection } from './use-server-connection';
import { AppGame } from '@/app-game-support/app-game';
import { Player, MatchID } from '@/app-game-support/types';
import { connectionStatusText } from './connection-status-text';
import { useSearchParamData } from '@/url-tools';
import { GameBoardWrapper } from '../game-board-wrapper';
import { DebugModeActions } from './debug-mode-actions';
import { useOnlineMatchInfo } from './use-online-match-info';

interface ServerConnectionWithResponse extends ServerConnection {
  serverResponse: NonNullable<ServerConnection['serverResponse']>;
}

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
    const message =
      connectionStatus === 'connected'
        ? 'Server connected: awaiting response ...'
        : `Server not connected: ${connectionStatusText(connectionStatus)}`;
    return <div>{message}</div>;
  }

  return (
    <ConnectedMatch
      game={game}
      player={player}
      serverConnection={{ ...serverConnection, serverResponse }}
    />
  );
}

function ConnectedMatch({
  game,
  player,
  serverConnection,
}: {
  game: AppGame;
  player: Player;
  serverConnection: ServerConnectionWithResponse;
}): JSX.Element {
  const { connectionStatus, serverResponse } = serverConnection;
  const { moves, events, actionRequestStatus, matchState } = useOnlineMatchInfo(
    game,
    player,
    serverConnection,
    serverResponse.matchState,
  );
  const { debugMode } = useSearchParamData();

  return (
    <div>
      {debugMode && <DebugModeActions serverConnection={serverConnection} />}
      <GameBoardWrapper
        game={game}
        viewingPlayer={player.id}
        connectionStatus={connectionStatus}
        actionRequestStatus={actionRequestStatus}
        matchState={matchState}
        moves={moves}
        events={events}
      />
    </div>
  );
}
