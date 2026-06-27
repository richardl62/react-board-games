import { sAssert } from '../../../../utils/assert.js';
import { Card } from '../../../../utils/cards/types.js';
import { reorderFollowingDrag } from '../../../../utils/reorder-following-drag.js';
import { ServerData, GameStage, makeCardSetID, CardSetID, PlayerID, cardSetIDToPlayerID, PlayerData } from '../server-data.js';
import { MoveArg0, outOfSequenceMove } from '../../../move-fn.js';

interface FromTo {
  from: { cardSetID: CardSetID; index: number };
  to: { cardSetID: CardSetID; index?: number };
}

function dragPermitted(state: ServerData, { to, from }: FromTo): boolean {
  const fromID = makeCardSetID(from.cardSetID);
  const toID = makeCardSetID(to.cardSetID);

  if (fromID === toID && fromID !== CardSetID.Shared) {
    return true;
  }

  if (state.stage === GameStage.SettingBox) {
    return toID === CardSetID.Shared || fromID === CardSetID.Shared;
  }

  if (state.stage === GameStage.Pegging) {
    return toID === CardSetID.Shared;
  }

  sAssert(false, 'Cannot determined result of dragPermitted');
}

function moveBetweenCardSets(
  fromCards: Card[],
  fromIndex: number,
  toCards: Card[],
  /** A null toIndex implied add to end */
  toIndex?: number,
) {
  const card = fromCards.splice(fromIndex, 1)[0];

  if (toIndex) {
    // Shuffle up cards at position toIndex or greater
    for (let i = toCards.length; i > toIndex; --i) {
      toCards[i] = toCards[i - 1];
    }

    toCards[toIndex] = card;
  } else {
    toCards.push(card);
  }
}

export const drag = outOfSequenceMove(function drag(
  { G: state, getPlayerData, setPlayerData }: MoveArg0<ServerData, PlayerData>,
  { to, from }: FromTo,
): void {
  if (!dragPermitted(state, { to, from })) {
    console.log('Attempted drag is not pemitted: from ', from, ' to ', to);
    return;
  }

  const fromID = makeCardSetID(from.cardSetID);
  const toID = makeCardSetID(to.cardSetID);

  sAssert(from.index !== null);
  if (fromID === toID) {
    if (to.index !== undefined) {
      if (fromID === CardSetID.Shared) {
        reorderFollowingDrag(state.shared.hand, from.index, to.index);
      } else {
        const pid = cardSetIDToPlayerID(fromID as PlayerID);
        const pd = getPlayerData(pid);
        reorderFollowingDrag(pd.hand, from.index, to.index);
        setPlayerData(pid, pd);
      }
    }
  } else if (state.stage === GameStage.Pegging) {
    sAssert(toID === CardSetID.Shared, 'unexpected action during pegging');
    const fromPid = cardSetIDToPlayerID(fromID as PlayerID);
    const fromPd = getPlayerData(fromPid);
    const card = fromPd.hand.splice(from.index, 1)[0];
    setPlayerData(fromPid, fromPd);
    state.shared.hand.push(card);
  } else {
    // SettingBox: move between card sets
    const getHand = (id: CardSetID): Card[] =>
      id === CardSetID.Shared
        ? state.shared.hand
        : getPlayerData(cardSetIDToPlayerID(id as PlayerID)).hand;

    const fromHand = getHand(fromID);
    const toHand = getHand(toID);
    moveBetweenCardSets(fromHand, from.index, toHand, to.index);

    if (fromID !== CardSetID.Shared) {
      const pid = cardSetIDToPlayerID(fromID as PlayerID);
      setPlayerData(pid, getPlayerData(pid));
    }
    if (toID !== CardSetID.Shared) {
      const pid = cardSetIDToPlayerID(toID as PlayerID);
      setPlayerData(pid, getPlayerData(pid));
    }
  }
});
