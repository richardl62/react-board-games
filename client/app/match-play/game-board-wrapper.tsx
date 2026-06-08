import { JSX, useCallback, useEffect, useMemo } from 'react';
import { AppGame } from '@/app-game-support/app-game';
import { MatchData } from '@shared/match-data';
import { Ctx } from '@shared/game-control/ctx';
import { ConnectionStatus } from './online/use-server-connection';
import { MatchStatus, UntypedMoves } from '@/app-game-support/board-props';
import { EventsAPI } from '@shared/game-control/events';
import { getPlayerStatus } from '@/app-game-support/player-status';
import { PlayerID } from '@shared/game-control/playerid';

/** Status of last requested action */
export interface ActionRequestStatus {
  /** True if we are currently waiting for the server to respond to an action request.
   */
  waitingForServer: boolean;

  /* True if the last user-requested action was ignored.  This could occur either if
  we are waiting for a response from the server (in which case waitingForServer will
  be set), or if there is no connection to the server.
  */
  lastActionIgnored: boolean;
}

interface Props {
  game: AppGame;

  /** The player for whom we are rendering the board. This is used to determine what
  secret information to show, and for other display purposes. It is also used
  together with ctx.currentPlayer to determine whether game actions (moves and events)
  are enabled. */
  viewingPlayer: PlayerID;

  matchData: MatchData;
  errorInLastAction: string | null;

  connectionStatus: ConnectionStatus;
  actionRequestStatus: ActionRequestStatus;

  moves: UntypedMoves;
  events: EventsAPI;
}

// Renders the game board for a particular game.
// It is the highest level at which the no distinction between online and offline matches is made.
export function GameBoardWrapper(props: Props): JSX.Element {
  const {
    game,
    matchData,
    viewingPlayer,
    connectionStatus,
    actionRequestStatus,
    errorInLastAction,
    moves,
    events,
  } = props;

  const getPlayerName = useCallback(
    (playerID: string) => {
      return getPlayerStatus(matchData.playerData, playerID).name;
    },
    [matchData.playerData],
  );

  const matchStatus: MatchStatus = useMemo(() => {
    return {
      connectionStatus,
      playerData: matchData.playerData,
      actionRequestStatus,
      errorInLastAction,
    };
  }, [connectionStatus, errorInLastAction, matchData.playerData, actionRequestStatus]);

  const ctx = useMemo(() => {
    return new Ctx(matchData.ctxData);
  }, [matchData.ctxData]);

  const allJoined = useMemo(
    () =>
      ctx.playOrder.every(
        (pid) => getPlayerStatus(matchData.playerData, pid).connectionStatus !== 'not joined',
      ),
    [ctx.playOrder, matchData.playerData],
  );

  // KLUDGE: Set the document title on every render. The avoids some issues with it not updating
  // properly in offline matches.
  useEffect(() => {
    const status = allJoined ? `${getPlayerName(ctx.currentPlayer)} to play` : 'Game not started';
    const title = `${status} - ${game.displayName}`;
    document.title = title;
  });

  const Board = game.board;
  return (
    <Board
      G={matchData.state}
      viewingPlayer={viewingPlayer}
      ctx={ctx}
      moves={moves}
      events={events}
      getPlayerName={getPlayerName}
      matchStatus={matchStatus}
      allJoined={allJoined}
    />
  );
}
