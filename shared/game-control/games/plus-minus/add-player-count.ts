import { ServerData } from './server-data.js';
import { MoveArg0 } from '../../move-fn.js';

export function addPlayerCount(
  { G, ctx, viewingPlayer }: MoveArg0<ServerData>,
  value: number,
): void {
  G.playerCount[viewingPlayer] += value;

  const playerCounts = ctx.playOrder.map((pid) => G.playerCount[pid]);
  if (playerCounts.length > 1) {
    const candidateSnap = playerCounts[0];

    if (playerCounts.every((x) => x === candidateSnap)) {
      for (const pid of ctx.playOrder) {
        G.playerCount[pid] = 0;
      }
      G.lastSnap = candidateSnap;
    }
  }
}
