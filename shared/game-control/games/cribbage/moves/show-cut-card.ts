import { ServerData } from '../server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

export const showCutCard = outOfSequenceMove(function showCutCard(
  { G }: MoveArg0<ServerData>,
  _arg: void,
): void {
  G.cutCard.visible = true;
});
