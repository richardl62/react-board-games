import { JSX, useCallback, useEffect, useMemo } from 'react';
import { AppGame } from '@/app-game-support/app-game';
import { MatchState } from '@shared/match-state';
import { Ctx } from '@shared/game-control/ctx';
import { ConnectionStatus } from './online/use-server-connection';
import { MatchStatus, UntypedMoves } from '@/app-game-support/board-props';
import { EventsAPI } from '@shared/game-control/events';
import { getPlayerStatus } from '@/app-game-support/player-status';
import { PlayerID } from '@shared/game-control/playerid';

/** Status of last requested action */
export interface ActionRequestStatus {
  /** True if we are currently waiting for the server to respond to one or more action
   * requests.
   */
  waitingForServer: boolean;

  /** True if the last action was applied optimistically and sent to the server, but the
   * connection was lost before a response arrived and is unlikely to ever arrive. The
   * board now shows the latest state received from the server, which may or may not
   * reflect that action.
   */
  lastActionUnconfirmed: boolean;

  /** True if a server response didn't match the locally-predicted state for the same
   * action. This indicates a bug (local prediction is meant to mirror the server
   * exactly). The board now shows the server's state, discarding any other pending
   * predictions.
   */
  predictionDiverged: boolean;
}

interface Props {
  game: AppGame;

  /** The player for whom we are rendering the board. This is used to determine what
  secret information to show, and for other display purposes. It is also used
  together with ctx.currentPlayer to determine whether game actions (moves and events)
  are enabled. */
  viewingPlayer: PlayerID;

  matchState: MatchState;

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
    matchState,
    viewingPlayer,
    connectionStatus,
    actionRequestStatus,
    moves,
    events,
  } = props;

  const getPlayerName = useCallback(
    (playerID: string) => {
      return getPlayerStatus(matchState.playerData, playerID).name;
    },
    [matchState.playerData],
  );

  const matchStatus: MatchStatus = useMemo(() => {
    return {
      connectionStatus,
      playerData: matchState.playerData,
      actionRequestStatus,
      errorInLastAction: matchState.errorInLastAction,
    };
  }, [connectionStatus, matchState.playerData, matchState.errorInLastAction, actionRequestStatus]);

  const ctx = useMemo(() => {
    return new Ctx(matchState.ctxData);
  }, [matchState.ctxData]);

  const allJoined = useMemo(
    () =>
      ctx.playOrder.every(
        (pid) => getPlayerStatus(matchState.playerData, pid).connectionStatus !== 'not joined',
      ),
    [ctx.playOrder, matchState.playerData],
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
      G={matchState.state}
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
