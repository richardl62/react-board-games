import { AppGame } from '@/app-game-support/app-game';
import { Player } from '@/app-game-support/types';
import { JSX } from 'react';
import { GameBoardWrapper } from '../game-board-wrapper';
import { useOnlineMatchInfo } from './use-online-match-info';
import { ServerConnection } from './use-server-connection';
import { DebugModeActions } from './debug-mode-actions';
import { useSearchParamData } from '@/url-tools';

interface ServerConnectionWithResponse extends ServerConnection {
  serverResponse: NonNullable<ServerConnection['serverResponse']>;
}

interface StandardMatchPlayProps {
  game: AppGame;
  player: Player;
  serverConnection: ServerConnectionWithResponse;
}

export function StandardMatchPlay({
  game,
  player,
  serverConnection,
}: StandardMatchPlayProps): JSX.Element {
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
