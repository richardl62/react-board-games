import { PlayerID } from '../../../playerid.js';
import { sAssert } from '../../../../utils/assert.js';
import { copyJSON } from '../../../../utils/copy-json.js';
import { PlayerData, PlayerDataDictionary, ServerData, UndoItem } from '../server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

type Arg0 = Pick<MoveArg0<ServerData, PlayerData>, 'G' | 'ctx' | 'getPlayerData'>;

export function makeUndoItem({ G, ctx, getPlayerData }: Arg0, playerID: PlayerID): UndoItem {
  const playerData: PlayerDataDictionary = {};
  for (const pid of ctx.playOrder) {
    playerData[pid] = copyJSON(getPlayerData(pid));
  }

  return {
    sharedPileData: copyJSON(G.sharedPileData),
    playerID,
    playerData,
    moveToSharedPile: G.moveToSharedPile,
  };
}

export const undo = outOfSequenceMove(function undo(
  { G, ctx, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  _arg: void,
): void {
  const undoItem = G.undoItems.pop();
  sAssert(undoItem, 'No undo data available');

  G.sharedPileData = undoItem.sharedPileData;
  for (const pid of ctx.playOrder) {
    const playerData = undoItem.playerData[pid];
    sAssert(playerData, `Missing undo data for player ${pid}`);
    setPlayerData(pid, playerData);
  }

  // We don't want the move required message after an undo
  G.moveToSharedPile = undoItem.moveToSharedPile === 'done' ? 'done' : 'not done';
});
