// Online match play with optimistic updates.
//
// This hook sits between the player's actions (moves/end-turn/end-match) and the
// server connection. Its job is to make online play feel as immediate as offline
// play, and to behave sensibly when the network is unreliable.
//
// The code here is a thin adapter around usePendingActions. Its job is to map the
// game's moves/events onto action submissions, register the response handler on the
// connection, and choose what state to show the board. All of the reliability
// machinery - the optimistic prediction shown on the board, the queue of actions
// awaiting confirmation, the "send only over a confirmed connection" policy,
// reconnection handling, and server reconciliation - lives in usePendingActions
// (see use-pending-actions.ts).
import { AppGame } from '@/app-game-support/app-game';
import { Player } from '@/app-game-support/types';
import { EventsAPI } from '@shared/game-control/events';
import { UntypedMoves } from '@/app-game-support/board-props';
import { useMemo } from 'react';
import { ServerConnection } from './use-server-connection';
import { ActionRequestStatus } from '../game-board-wrapper';
import { MatchState } from '@shared/match-state';
import { usePendingActions } from './use-pending-actions';

// Return information suitable for an online game.  This is
// - match state (which may be an optimistic prediction)
// - actions (moves and events)
// - the status of action requests (e.g. whether we are waiting for the server)
export function useOnlineMatchInfo(
  appGame: AppGame,
  player: Player,
  { sendMatchRequest, connectionStatus, responseHandlerRef }: ServerConnection,
  matchState: MatchState,
): {
  moves: UntypedMoves;
  events: EventsAPI;
  actionRequestStatus: ActionRequestStatus;
  matchState: MatchState;
} {
  const pending = usePendingActions(
    appGame,
    player,
    connectionStatus,
    sendMatchRequest,
    matchState,
  );

  responseHandlerRef.current = pending.handleServerResponse;

  const { submit } = pending;
  const { moves, events } = useMemo(() => {
    const moves: UntypedMoves = {};
    for (const moveName of Object.keys(appGame.moves)) {
      moves[moveName] = (arg) => submit({ move: moveName, arg });
    }

    const events: EventsAPI = {
      endTurn: () => submit({ endTurn: true }),
      endMatch: () => submit({ endMatch: true }),
    };

    return { moves, events };
  }, [appGame.moves, submit]);

  const { waitingForServer, lastActionUnconfirmed, predictionDiverged } = pending;

  return useMemo(
    () => ({
      moves,
      events,
      actionRequestStatus: { waitingForServer, lastActionUnconfirmed, predictionDiverged },
      matchState: pending.matchState,
    }),
    [
      moves,
      events,
      waitingForServer,
      lastActionUnconfirmed,
      predictionDiverged,
      pending.matchState,
    ],
  );
}
