import { processGameRequest } from './process-game-request.js';
import { GameRequest, GameStage, PlayerData, ServerData } from '../server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const requestRevealHands = outOfSequenceMove(function requestRevealHands(
  { G, ctx, viewingPlayer, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  if (processGameRequest(GameRequest.RevealHand, ctx, viewingPlayer, getPlayerData, setPlayerData)) {
    for (const pid of ctx.playOrder) {
      const pd = getPlayerData(pid);
      setPlayerData(pid, { ...pd, hand: [...pd.fullHand] });
    }
    G.shared.hand = G.box;
    G.box = [];
    G.stage = GameStage.HandsRevealed;
  }
});
