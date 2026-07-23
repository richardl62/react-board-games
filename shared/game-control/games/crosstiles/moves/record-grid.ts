import { sAssert } from '../../../../utils/assert.js';
import { Letter } from '../config.js';
import { makeEmptyGrid } from './make-empty-grid.js';
import { PlayerData, ServerData, GameStage } from '../server-data.js';
import { ScoreWithCategory } from './set-score.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';
import { PlayerID } from '../../../playerid.js';

interface GridAndScore {
  grid: (Letter | null)[][];
  rack: (Letter | null)[];
  score: ScoreWithCategory | null;
}

type Arg0 = Pick<MoveArg0<ServerData, PlayerData>, 'G' | 'getPlayerData' | 'setPlayerData'>;

function doRecordGrid(arg0: Arg0, playerID: PlayerID, gridAndScore: GridAndScore): void {
  const { G, getPlayerData, setPlayerData } = arg0;

  if (G.stage !== GameStage.makingGrids) {
    throw new Error('Unexpected call to recordGrid - ' + G.stage);
  }

  const { grid, rack, score } = gridAndScore;

  setPlayerData(playerID, {
    ...getPlayerData(playerID),
    gridRackAndScore: {
      grid: grid.map((row) => [...row]),
      rack: [...rack],
      score,
    },
  });
}

export const recordGrid = outOfSequenceMove(function (
  arg0: MoveArg0<ServerData, PlayerData>,
  gridAndScore: GridAndScore,
): void {
  doRecordGrid(arg0, arg0.viewingPlayer, gridAndScore);
});

export function recordEmptyGrid(arg0: Arg0, playerID: PlayerID): void {
  const { selectedLetters } = arg0.getPlayerData(playerID);
  sAssert(selectedLetters);

  doRecordGrid(arg0, playerID, {
    grid: makeEmptyGrid(),
    rack: selectedLetters,
    score: null,
  });
}
