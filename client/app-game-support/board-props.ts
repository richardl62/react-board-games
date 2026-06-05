import { ActionRequestStatus } from '@/app/match-play/game-board-wrapper';
import { ConnectionStatus } from '@/app/match-play/online/use-server-connection';
import { Ctx } from '@shared/game-control/ctx';
import { EventsAPI } from '@shared/game-control/events';
import { PlayerID } from '@shared/game-control/playerid';
import { PublicPlayerMetadata } from '@shared/lobby/types';

export interface MatchStatus {
  connectionStatus: ConnectionStatus;

  playerData: PublicPlayerMetadata[];

  actionRequestStatus: ActionRequestStatus;

  /** A description of an error in the last move or event or null if there was no error.
   * Possible errors included moving out of turn, or uncaught exceptions. In general, an
   * error indicates a bug in game code.
   */
  errorInLastAction: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UntypedMoves = Record<string, (...args: any[]) => void>;

// The props used by the board in individual games.
export interface BoardProps<TypeG = unknown, Moves extends UntypedMoves = UntypedMoves> {
  G: TypeG;

  ctx: Ctx;

  /** The player for whom we are rendering the board. This is used to determine what
  secret information to show, and for other display purposes. It is also used
  together with ctx.currentPlayer to determine whether game actions (moves and events)
  are enabled. */
  viewingPlayer: PlayerID;

  moves: Moves;

  events: EventsAPI;

  matchStatus: MatchStatus;

  // Start of convenience properties.
  getPlayerName: (pid: string) => string;

  allJoined: boolean;
}
