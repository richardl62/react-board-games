import { recordEmptyGrid } from './record-grid.js';
import { PlayerData, ServerData, GameStage } from '../server-data.js';
import { doSetScore } from './set-score.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const doneRecordingGrid = outOfSequenceMove(function (
  arg0: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  const { G, ctx, viewingPlayer: playerID, getPlayerData, setPlayerData } = arg0;

  // This function is called during the scoring stage occur if no grid has been recorded.
  // I'm not sure if this is desirable, but it seems to work.
  if (G.stage !== GameStage.makingGrids && G.stage !== GameStage.scoring) {
    throw new Error(`doneRecordingGrid during ${G.stage} stage`);
  }

  if (!getPlayerData(playerID).gridRackAndScore) {
    recordEmptyGrid(arg0, playerID);
  }
  setPlayerData(playerID, { ...getPlayerData(playerID), doneRecordingGrid: true });

  const allPlayersDoneRecordingGrids = ctx.playOrder.every(
    (pid) => getPlayerData(pid).doneRecordingGrid,
  );

  if (allPlayersDoneRecordingGrids) {
    G.stage = GameStage.scoring;
    applyRecordedScores(arg0);
  }
});

function applyRecordedScores(arg0: MoveArg0<ServerData, PlayerData>): void {
  const { ctx, getPlayerData } = arg0;

  for (const pid of ctx.playOrder) {
    const score = getPlayerData(pid).gridRackAndScore?.score;
    if (score) {
      doSetScore(arg0, pid, score);
    }
  }
}
