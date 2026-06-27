import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';
import { sAssert } from '../../../../utils/assert.js';
import { GameRequest, GameStage, PlayerData, ServerData } from '../server-data.js';
import { processGameRequest } from './process-game-request.js';

export const doneMakingBox = outOfSequenceMove(function doneMakingBox(
  { G, ctx, viewingPlayer, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  sAssert(G.stage === GameStage.SettingBox);

  if (processGameRequest(GameRequest.FinishSettingBox, ctx, viewingPlayer, getPlayerData, setPlayerData)) {
    for (const pid of ctx.playOrder) {
      const pd = getPlayerData(pid);
      setPlayerData(pid, { ...pd, fullHand: [...pd.hand] });
    }

    G.box = G.shared.hand;
    G.shared.hand = [];
    G.stage = GameStage.Pegging;
  }
});
