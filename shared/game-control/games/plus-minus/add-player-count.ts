import { ServerData } from './server-data.js';
import { MoveArg0 } from '../../move-fn.js';

interface PlayerGameData { count: number }

export function addPlayerCount(
  { G, ctx, viewingPlayer, getPlayerData, setPlayerData }: MoveArg0<ServerData>,
  value: number,
): void {
  const current = (getPlayerData(viewingPlayer) as PlayerGameData | undefined)?.count ?? 0;
  const newCount = current + value;
  setPlayerData(viewingPlayer, { count: newCount });

  // Snap: when all players reach the same count, record it and reset all to 0.
  const allCounts = ctx.playOrder.map((pid) => {
    if (pid === viewingPlayer) return newCount;
    return (getPlayerData(pid) as PlayerGameData | undefined)?.count ?? 0;
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
