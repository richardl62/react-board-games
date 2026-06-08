import { AppGame } from '@/app-game-support/app-game';
import { MatchState } from '@shared/match-state';
import { UntypedMoves } from '@/app-game-support/board-props';
import { EventsAPI } from '@shared/game-control/events';
import { applyActionLocally } from '../apply-action-locally';
import { WsRequestedAction } from '@shared/ws-requested-action';

export function makePlayerActions(
  game: AppGame,
  playerID: string,
  matchState: MatchState,
  setMatchState: (arg: MatchState) => void,
): { moves: UntypedMoves; events: EventsAPI } {
  const doAction = (action: WsRequestedAction) => {
    setMatchState(applyActionLocally(game, action, playerID, matchState));
  };

  const events: EventsAPI = {
    endTurn: () => doAction({ endTurn: true }),
    endMatch: () => doAction({ endMatch: true }),
  };

  const moves: UntypedMoves = {};
  for (const moveName in game.moves) {
    moves[moveName] = (arg: unknown) => doAction({ move: moveName, arg });
  }

  return { moves, events };
}
