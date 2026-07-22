import { Letter } from '@game-control/games/crosstiles/config';
import { ServerData } from '@game-control/games/crosstiles/server-data';
import { ReducerState } from './cross-tiles-reducer';
import { makeEmptyGrid } from '@game-control/games/crosstiles/moves/make-empty-grid';

export function reflectServerData(
  state: ReducerState,
  newServerData: ServerData,
  selectedLetters: Letter[] | null,
): ReducerState {
  const oldRound = state.serverData?.round;
  const newRound = newServerData.round;

  const { playerID, gridChangeTimestamp } = state;

  if (oldRound != newRound) {
    return {
      rack: selectedLetters && [...selectedLetters],
      grid: makeEmptyGrid(),
      clickMoveStart: null,
      serverData: newServerData,

      playerID,
      gridChangeTimestamp,
    };
  }

  return { ...state, serverData: newServerData };
}
