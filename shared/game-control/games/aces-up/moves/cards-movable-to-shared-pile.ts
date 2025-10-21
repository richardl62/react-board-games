import { PlayerID } from "../../../playerid.js";
import { CardNonJoker } from "../../../utils/cards/types.js";
import { moveableToSharedPile } from "./move-type.js";
import { ServerData } from "../server-data.js";
import { makeSharedPiles } from "../misc/shared-pile.js";
import { makeDiscardPiles } from "./make-discard-pile.js";

function moveableCards(G: ServerData, playerID: PlayerID) : CardNonJoker[] {
    const moveable: CardNonJoker[] = [];

    const discardPiles = makeDiscardPiles(G, playerID);
    for(const pile of discardPiles) {
        const topCard = pile.topCard;
        if(topCard) {
            moveable.push(topCard);
        }
    }

    const playerData = G.playerData[playerID];
    for(const card of playerData.hand) {
        moveable.push(card);
    }

    if(playerData.mainPile.length > 0) {
        moveable.push(playerData.mainPile.slice(-1)[0]);
    }

    return moveable;
}

export function cardsMovableToSharedPile(
    G: ServerData, 
    playerID: PlayerID
) : CardNonJoker[] {
    const sharedPiles = makeSharedPiles(G);

    const moveable = (card: CardNonJoker) => {
        for(const pile of sharedPiles) {
            if(moveableToSharedPile(G.options, card, pile)) {
                return true;
            }
        }

        return false;
    };
    
    return moveableCards(G, playerID).filter(moveable);
}
