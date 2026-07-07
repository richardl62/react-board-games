import { MoveArg0 } from '../../../move-fn.js';
import { sAssert } from '../../../../utils/assert.js';
import { CardNonJoker } from '../../../../utils/cards/types.js';
import { handSize } from '../config.js';
import { CardID } from './card-id.js';
import { makeDiscardPile } from './make-discard-pile.js';
import { PlayerData, ServerData } from '../server-data.js';
import { makeSharedPileData, makeSharedPiles, SharedPile } from '../misc/shared-pile.js';

type ReadArg0 = Pick<MoveArg0<ServerData, PlayerData>, 'G' | 'getPlayerData'>;
type WriteArg0 = Pick<MoveArg0<ServerData, PlayerData>, 'G' | 'getPlayerData' | 'setPlayerData'>;

function removeOneCard(cards: CardNonJoker[], index: number): CardNonJoker {
  const card = cards.splice(index, 1)[0];
  sAssert(card);
  return card;
}

export function emptyPile(arg0: ReadArg0, id: CardID): boolean {
  if (id.area === 'discardPileAll') {
    return makeDiscardPile(arg0, id.owner, id.pileIndex).isEmpty;
  }

  return !getCard(arg0, id);
}

export function getCard(arg0: ReadArg0, id: CardID): CardNonJoker | undefined {
  const { G, getPlayerData } = arg0;

  if (id.area === 'sharedPiles') {
    const sp = new SharedPile(G.sharedPileData[id.index], G.options);
    return sp.top;
  }

  if (id.area === 'hand') {
    return getPlayerData(id.owner).hand[id.index];
  }

  if (id.area === 'discardPileCard') {
    const pile = makeDiscardPile(arg0, id.owner, id.pileIndex);
    sAssert(pile.length === id.cardIndex + 1, 'getCard: unexpected card index in discard pile');
    return pile.topCard;
  }

  if (id.area === 'playerPile') {
    return getPlayerData(id.owner).mainPile.at(-1);
  }

  throw new Error('Problem getting cards - unexpected card ID');
}

export function stealTopCard(arg0: WriteArg0, id: CardID, thiefCard: CardNonJoker): CardNonJoker {
  const { G, getPlayerData, setPlayerData } = arg0;

  if (id.area === 'sharedPiles') {
    const sp = makeSharedPiles(G)[id.index];
    return sp.stealTopCard(thiefCard);
  }

  if (id.area === 'discardPileCard' || id.area === 'discardPileAll') {
    const pile = makeDiscardPile(arg0, id.owner, id.pileIndex);
    const stolen = pile.stealTopCard(thiefCard);
    setPlayerData(id.owner, getPlayerData(id.owner));
    return stolen;
  }

  throw new Error('Problem removing card - unexpected card ID');
}

export function removeCard(arg0: WriteArg0, id: CardID): CardNonJoker {
  sAssert(id.area !== 'sharedPiles', 'removeCard: sharedPiles not supported');
  const { getPlayerData, setPlayerData } = arg0;

  if (id.area === 'hand') {
    const playerData = getPlayerData(id.owner);
    const card = removeOneCard(playerData.hand, id.index);
    setPlayerData(id.owner, playerData);
    return card;
  }

  if (id.area === 'discardPileCard') {
    const pile = makeDiscardPile(arg0, id.owner, id.pileIndex);
    sAssert(
      pile.length === id.cardIndex + 1,
      'removeCard: attempt to remove non-top card from discard pile',
    );
    const card = pile.removeFromTop(1)[0];
    setPlayerData(id.owner, getPlayerData(id.owner));
    return card;
  }

  if (id.area === 'playerPile') {
    const playerData = getPlayerData(id.owner);
    const card = playerData.mainPile.pop();
    sAssert(card);
    setPlayerData(id.owner, playerData);
    return card;
  }

  throw new Error('Problem removing card - unexpected card ID');
}

export function addCard(arg0: WriteArg0, id: CardID, card: CardNonJoker): void {
  const { G, getPlayerData, setPlayerData } = arg0;
  const sharedPiles = makeSharedPiles(G);

  if (id.area === 'sharedPiles') {
    sharedPiles[id.index].addStandardCard(card);

    // Ensure that the last shared pile is empty. (Having an empty pile allows aces to be
    // moved. )
    // Kludge?: Reply on topCard() returning undefined when given an empty pile.
    if (!sharedPiles.at(-1)!.isEmpty) {
      G.sharedPileData.push(makeSharedPileData([]));
    }
    return;
  }

  if (id.area === 'hand') {
    const playerData = getPlayerData(id.owner);
    sAssert(playerData.hand.length < handSize, 'Cannot add card to full hand');
    playerData.hand.splice(id.index, 0, card);
    setPlayerData(id.owner, playerData);
    return;
  }

  if (id.area === 'playerPile') {
    const playerData = getPlayerData(id.owner);
    playerData.mainPile.push(card);
    setPlayerData(id.owner, playerData);
    return;
  }

  if (id.area === 'discardPileAll' || id.area === 'discardPileCard') {
    const discardPile = makeDiscardPile(arg0, id.owner, id.pileIndex);
    discardPile.add(card);
    setPlayerData(id.owner, getPlayerData(id.owner));
    return;
  }

  throw new Error('Cannot add card - unexpected card ID');
}

export function clearPile(arg0: WriteArg0, id: CardID, killerCard: CardNonJoker): void {
  const { G, getPlayerData, setPlayerData } = arg0;

  if (id.area === 'sharedPiles') {
    makeSharedPiles(G)[id.index].clear(killerCard);
    return;
  }

  if (id.area === 'discardPileAll' || id.area === 'discardPileCard') {
    const discardPile = makeDiscardPile(arg0, id.owner, id.pileIndex);
    discardPile.clear(killerCard);
    setPlayerData(id.owner, getPlayerData(id.owner));
    return;
  }

  throw new Error('Cannot clear pile');
}
