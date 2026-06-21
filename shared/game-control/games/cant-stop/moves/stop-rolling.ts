import { ServerData } from '../server-data.js';
import { MoveArg0 } from '../../../move-fn.js';
import { doEndTurn } from './end-turn.js';
import { columnValues } from '../config.js';

export function stopRolling(arg0: MoveArg0<ServerData>, _arg: void): void {
  const { G, viewingPlayer: playerID } = arg0;
  const heights = G.columnHeights[playerID];

  for (const col of columnValues) {
    const h = heights[col];
    h.owned = h.thisTurn = h.thisScoringChoice;
  }

  doEndTurn(arg0);
}
