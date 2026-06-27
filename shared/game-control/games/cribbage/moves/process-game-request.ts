import { Ctx } from '../../../ctx.js';
import { GameRequest, PlayerData } from '../server-data.js';

/** Process a game request (e.g. from a new deal).
 * If all players have made the same request, clear the recorded requests and return true.
 * Otherwise, record the request and return false.
 */
export function processGameRequest(
  request: GameRequest,
  ctx: Ctx,
  viewingPlayer: string,
  getPlayerData: (pid: string) => PlayerData,
  setPlayerData: (pid: string, data: PlayerData) => void,
): boolean {
  const pd = getPlayerData(viewingPlayer);
  setPlayerData(viewingPlayer, { ...pd, request });

  const allRequested = ctx.playOrder.every((pid) => getPlayerData(pid).request === request);

  if (ctx.numPlayers === 1 || allRequested) {
    for (const pid of ctx.playOrder) {
      const p = getPlayerData(pid);
      setPlayerData(pid, { ...p, request: null });
    }
    return true;
  }

  return false;
}
