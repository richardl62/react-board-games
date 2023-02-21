import { sAssert } from "../../../utils/assert";
import { CardNonJoker, nextRank } from "../../../utils/cards/types";
import { debugOptions } from "../game-support/config";
import { GameContext } from "../game-support/game-context";
import { getCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { SharedPile } from "./shared-pile";

export function moveableToSharedPile(card: CardNonJoker, pile: SharedPile) : boolean {

    if(pile.rank === "Q") {
        // You can't add to a full pile
        return false;
    } 
    
    return card.rank === "K" || card.rank === nextRank(pile.rank);
}

export function canDrop(
    gameContext: GameContext,
    {to, from}: {to: CardID, from: CardID}
) : boolean {
    if (to.area === "sharedPiles") {
        if(debugOptions.skipCheckOnAddedToSharedPiles) {
            return true;
        }

        const card = getCard(gameContext.G, from);
        const pile = gameContext.G.sharedPiles[to.index];

        return moveableToSharedPile(card, pile);
    }

    if (from.area === "sharedPiles") {
        console.warn("Attempt to drag from shared piles");
        return false;
    }

    if(to.owner !== gameContext.ctx.currentPlayer) {
        return false;
    }

    if(from.owner !== gameContext.ctx.currentPlayer) {
        console.warn("Attempt to drag from another players pile");
        return false;
    }

    if(from.area === "discardPiles") {
        // Drops from discard piles to shared piles are handled above.
        // This case is from drops from one discard pile to another
        return to.area === "discardPiles"
            && to.cardIndex === "any"
            && from.pileIndex !== to.pileIndex;
    }

    if(to.area === "hand") {
        return from.area === "hand" &&
            from.index !== to.index;
    }

    if (to.area === "playerPile") {
        return false;
    }

    if (to.area === "discardPiles") {
        // Dropping is supported on the pile as a whole rather than
        // on individual cards in the pile.
        return to.cardIndex === "any" && from.area === "hand";
    }

    sAssert(false, "Cannot determine if drop is permissable");
}
