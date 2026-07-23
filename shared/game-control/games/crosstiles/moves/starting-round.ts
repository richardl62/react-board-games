import { GameStage, PlayerData, ServerData } from '../server-data.js';
import { startRound } from './start-round.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const readyForNextRound = outOfSequenceMove(function (
  arg0: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  const { G, ctx, viewingPlayer: playerID, getPlayerData, setPlayerData } = arg0;

  if (G.stage !== GameStage.scoring) {
    throw new Error('Unexpected call to readyForNextRound');
  }

  setPlayerData(playerID, { ...getPlayerData(playerID), readyForNextRound: true });

  const allReady = ctx.playOrder.every((pid) => getPlayerData(pid).readyForNextRound);

  if (allReady) {
    G.stage = GameStage.makingGrids;
    startRound(arg0);
  }
});
