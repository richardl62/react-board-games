import { MoveArg0 } from '../../../move-fn.js';
import { PlayerID } from '../../../playerid.js';
import { CardNonJoker } from '../../../../utils/cards/types.js';
import { moveableToSharedPile } from './move-type.js';
import { PlayerData, ServerData } from '../server-data.js';
import { makeSharedPiles } from '../misc/shared-pile.js';
import { makeDiscardPiles } from './make-discard-pile.js';

type Arg0 = Pick<MoveArg0<ServerData, PlayerData>, 'G' | 'getPlayerData'>;

function moveableCards(arg0: Arg0, playerID: PlayerID): CardNonJoker[] {
  const moveable: CardNonJoker[] = [];

  const discardPiles = makeDiscardPiles(arg0, playerID);
  for (const pile of discardPiles) {
    const topCard = pile.topCard;
    if (topCard) {
      moveable.push(topCard);
    }
  }

  const playerData = arg0.getPlayerData(playerID);
  for (const card of playerData.hand) {
    moveable.push(card);
  }

  if (playerData.mainPile.length > 0) {
    moveable.push(playerData.mainPile.slice(-1)[0]);
  }

  return moveable;
}

export function cardsMovableToSharedPile(arg0: Arg0, playerID: PlayerID): CardNonJoker[] {
  const sharedPiles = makeSharedPiles(arg0.G);

  const moveable = (card: CardNonJoker) => {
    for (const pile of sharedPiles) {
      if (moveableToSharedPile(arg0.G.options, card, pile)) {
        return true;
      }
    }

    return false;
  };

  return moveableCards(arg0, playerID).filter(moveable);
}
