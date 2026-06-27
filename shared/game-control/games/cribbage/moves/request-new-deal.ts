import { processGameRequest } from './process-game-request.js';
import { GameRequest, PegPositions, PlayerData, ServerData } from '../server-data.js';
import { newDealData } from '../starting-server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const requestNewDeal = outOfSequenceMove(function requestNewDeal(
  { G, ctx, random, viewingPlayer, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  if (!processGameRequest(GameRequest.NewDeal, ctx, viewingPlayer, getPlayerData, setPlayerData)) {
    return;
  }

  const pegPositions: Record<string, PegPositions> = {};
  for (const pid of ctx.playOrder) {
    const pd = getPlayerData(pid);
    pegPositions[pid] = { score: pd.score, trailingPeg: pd.trailingPeg };
  }

  const { serverData, playerData } = newDealData(ctx, pegPositions, random);

  G.shared = serverData.shared;
  G.stage = serverData.stage;
  G.box = serverData.box;
  G.cutCard = serverData.cutCard;

  for (const [pid, pd] of Object.entries(playerData)) {
    setPlayerData(pid, pd);
  }
});
