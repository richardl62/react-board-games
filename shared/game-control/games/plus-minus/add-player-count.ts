import { PlayerGameData, ServerData } from './server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../move-fn.js';

function doAddPlayerCount(
  { G, ctx, viewingPlayer, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerGameData>,
  value: number,
): void {
  const current = getPlayerData(viewingPlayer).count;
  const newCount = current + value;
  setPlayerData(viewingPlayer, { count: newCount });

  // Snap: when all players reach the same count, record it and reset all to 0.
  const allCounts = ctx.playOrder.map((pid) => {
    if (pid === viewingPlayer) return newCount;
    return getPlayerData(pid).count;
  });

  if (allCounts.length > 1) {
    const candidate = allCounts[0];
    if (allCounts.every((c) => c === candidate)) {
      for (const pid of ctx.playOrder) {
        setPlayerData(pid, { count: 0 });
      }
      G.lastSnap = candidate;
    }
  }
}

export const addPlayerCount = outOfSequenceMove(doAddPlayerCount);
