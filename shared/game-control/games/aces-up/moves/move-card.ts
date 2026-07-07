import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';
import { PlayerID } from '../../../playerid.js';
import { sAssert } from '../../../../utils/assert.js';
import { reorderFollowingDrag } from '../../../../utils/reorder-following-drag.js';
import { sameJSON } from '../../../../utils/same-json.js';
import { addCard, clearPile, removeCard, stealTopCard } from './add-remove-card.js';
import { CardID } from './card-id.js';
import { cardsMovableToSharedPile } from './cards-movable-to-shared-pile.js';
import { DiscardPile } from '../misc/discard-pile.js';
import { endTurn, refillHand } from './end-turn.js';
import { makeDiscardPiles } from './make-discard-pile.js';
import { moveType as getMoveType } from './move-type.js';
import { PlayerData, ServerData, UndoItem } from '../server-data.js';
import { makeUndoItem } from './undo.js';

type Arg0 = MoveArg0<ServerData, PlayerData>;

function moveToSharedPileRequired(arg0: Arg0, playerID: PlayerID) {
  const { G } = arg0;
  return (
    G.options.addToSharedPileEachTurn &&
    G.moveToSharedPile !== 'done' &&
    cardsMovableToSharedPile(arg0, playerID).length !== 0
  );
}

function moveWithinDiscardPiles(
  discardPiles: DiscardPile[],
  { from, to }: { from: CardID; to: CardID },
) {
  sAssert(from.area === 'discardPileCard');
  sAssert(to.area === 'discardPileAll');
  sAssert(from.pileIndex !== to.pileIndex);

  const fromPile = discardPiles[from.pileIndex];
  const toPile = discardPiles[to.pileIndex];

  const movedCards = fromPile.removeFromTop(fromPile.length - from.cardIndex);
  toPile.add(...movedCards);
}

function doMoveCard(
  arg0: Arg0,
  /** PlayerID is the ID of the play who requested the move */
  { from, to }: { from: CardID; to: CardID },
): UndoItem | null {
  const { viewingPlayer: playerID, getPlayerData, setPlayerData } = arg0;

  let undoItem: UndoItem | null = makeUndoItem(arg0, playerID);

  const moveType = getMoveType(arg0, { from, to });
  if (moveType === 'steal') {
    const fromCard = removeCard(arg0, from);
    const stollenCard = stealTopCard(arg0, to, fromCard);
    addCard(arg0, from, stollenCard);
  } else if (moveType === 'clear') {
    const fromCard = removeCard(arg0, from);
    clearPile(arg0, to, fromCard);
  } else if (to.area === 'hand' && from.area === 'hand') {
    sAssert(to.owner === playerID && from.owner === playerID);
    const playerData = getPlayerData(playerID);
    reorderFollowingDrag(playerData.hand, from.index, to.index);
    setPlayerData(playerID, playerData);
    undoItem = null;
  } else if (to.area === 'discardPileAll' && from.area === 'discardPileCard') {
    moveWithinDiscardPiles(makeDiscardPiles(arg0, playerID), { from, to });
    setPlayerData(playerID, getPlayerData(playerID));
  } else {
    const card = removeCard(arg0, from);
    addCard(arg0, to, card);
  }

  return undoItem;
}

export const moveCard = outOfSequenceMove(function moveCard(
  arg0: Arg0,
  /** PlayerID is the ID of the play who requested the move */
  { from, to }: { from: CardID; to: CardID },
): void {
  const { G, viewingPlayer: playerID, getPlayerData } = arg0;

  if (sameJSON(from, to)) {
    return;
  }

  const moveType = getMoveType(arg0, { from, to });

  // Check move is valid. (Most of the checking is done in canDrag()/canDrop().
  // But the check that cards are played to discard piles before ending
  // the turn is done here.)
  const endOfTurn = moveType === 'move' && to.area === 'discardPileAll';

  if (endOfTurn) {
    if (moveToSharedPileRequired(arg0, playerID)) {
      G.moveToSharedPile = 'omitted';
      return;
    }
  }

  const undoItem = doMoveCard(arg0, { from, to });

  if (from.owner === playerID && to.area === 'sharedPiles') {
    G.moveToSharedPile = 'done';
  }

  // Post-move actions
  if (endOfTurn) {
    endTurn(arg0);
  } else {
    const playerData = getPlayerData(playerID);
    if (playerData.hand.length === 0) {
      refillHand(arg0, playerID);
      G.undoItems = [];
    } else {
      if (undoItem) {
        G.undoItems.push(undoItem);
      }
    }
  }
});
