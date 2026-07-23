import { GameStage, PlayerData, ServerData, initialGameData } from '../server-data.js';
import { startRound } from './start-round.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const readyForNewGame = outOfSequenceMove(function (
  arg0: MoveArg0<ServerData, PlayerData>,
  _option: void,
): void {
  const { G, ctx, viewingPlayer: playerID, getPlayerData, setPlayerData } = arg0;

  setPlayerData(playerID, { ...getPlayerData(playerID), readyForNewGame: true });

  const allReady = ctx.playOrder.every((pid) => getPlayerData(pid).readyForNewGame);

  if (allReady) {
    const { state, playerData } = initialGameData(ctx, G.options);
    Object.assign(G, state);

    for (const pid of ctx.playOrder) {
      setPlayerData(pid, playerData[pid]);
    }

    G.stage = GameStage.makingGrids;
    startRound(arg0);
  }
});
