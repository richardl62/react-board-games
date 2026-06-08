import { AppGame } from '@/app-game-support/app-game';
import { endMatch, endTurn } from '@shared/game-control/ctx';
import { matchMove } from '@shared/game-control/match-action';
import { ActiveMatchState, MatchState } from '@shared/match-state';
import { UntypedMoves } from '@/app-game-support/board-props';
import { EventsAPI } from '@shared/game-control/events';

export function makePlayerActions(
  game: AppGame,
  playerID: string,
  matchState: MatchState,
  setMatchState: (arg: MatchState) => void,
): { moves: UntypedMoves; events: EventsAPI } {
  const doAction = (action: (md: ActiveMatchState) => ActiveMatchState) => {
    try {
      const mutatedData = action(matchState);
      setMatchState({
        ...mutatedData,
        playerData: matchState.playerData,
        errorInLastAction: null,
      });
    } catch (e) {
      const errorInLastAction = e instanceof Error ? e.message : `Unrecognised error: ${String(e)}`;
      setMatchState({
        ...matchState,
        errorInLastAction,
      });
    }
  };

  const events: EventsAPI = {
    endTurn: () =>
      doAction((md) => {
        endTurn(md.ctxData);
        return md;
      }),
    endMatch: () =>
      doAction((md) => {
        endMatch(md.ctxData);
        return md;
      }),
  };

  const moves: UntypedMoves = {};
  for (const moveName in game.moves) {
    moves[moveName] = (arg: unknown) => {
      doAction((md) => matchMove(game, moveName, playerID, md, arg));
    };
  }

  return { moves, events };
}
