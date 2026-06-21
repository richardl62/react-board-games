import { ServerData } from '../server-data.js';
import { MoveArg0 } from '../../../move-fn.js';
import { doEndTurn } from './end-turn.js';
import { sAssert } from '../../../../utils/assert.js';
import { columnValues } from '../config.js';
// Call by a player to acknowledge that they are bust.
export function acknowledgeBust(arg0: MoveArg0<ServerData>, _arg: void): void {
  const { G, viewingPlayer: playerID } = arg0;
  const heights = G.columnHeights[playerID];

  sAssert(G.scoringChoice === 'bust', 'acknowledgeBust called when not bust.');

  // Clear any previous scoring choice.
  for (const col of columnValues) {
    const h = heights[col];
    h.thisScoringChoice = h.thisTurn = h.owned;
  }

  doEndTurn(arg0);
}
