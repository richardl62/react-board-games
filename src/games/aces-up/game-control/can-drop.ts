import { sAssert } from "../../../utils/assert";
import { CardNonJoker, nextRank } from "../../../utils/cards/types";
import { debugOptions } from "../game-support/config";
import { GameContext } from "../game-support/game-context";
import { emptyPile, getCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { SharedPile, rank } from "./shared-pile";
import { ServerData } from "./server-data";
import { OptionWrapper } from "../game-support/game-options";

export function moveableToSharedPile(
    G: ServerData,
    card: CardNonJoker, 
    pile: SharedPile
) : boolean {

    if(debugOptions.skipCheckOnAddedToSharedPiles) {
        return true;
    }

    if(rank(pile) === G.options.topRank) {
        // You can't add to a full pile
        return false;
    } 
    
    return card.rank === "K" || card.rank === nextRank(rank(pile));
}

export function canDrop(
    gameContext: GameContext,
    {to, from}: {to: CardID, from: CardID}
) : boolean {
    const { G } = gameContext;
    const options = new OptionWrapper(G.options);
    
    const fromCard = getCard(G, from);
    sAssert(fromCard);

    if ( options.isKiller(fromCard) || options.isThief(fromCard)) {
        // Special cards can't be moved to empty piles.
        return !emptyPile(G, to);
    }

    if (to.area === "sharedPiles") {
        if(from.area === "discardPileCard") {
            const fromPile = G.playerData[from.owner].discards[from.pileIndex];
            if(from.cardIndex !== fromPile.length-1) {
                return false;
            }
        }

        const toPile = G.sharedPiles[to.index];

        return moveableToSharedPile(G, fromCard, toPile);
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

    if(from.area === "discardPileCard") {
        // Drops from discard piles to shared piles are handled above.
        // This case is from drops from one discard pile to another
        return to.area === "discardPileAll"
            && from.pileIndex !== to.pileIndex;
    }

    if(to.area === "hand") {
        return from.area === "hand" &&
            from.index !== to.index;
    }

    if (to.area === "playerPile") {
        return false;
    }

    if (to.area === "discardPileAll") {
        // Dropping is supported on the pile as a whole rather than
        // on individual cards in the pile.
        return from.area === "hand";
    }

    if (to.area === "discardPileCard") {
        // Dropping is supported on the pile as a whole rather than
        // on individual cards in the pile.
        return false;
    }


    sAssert(false, "Cannot determine if drop is permissable");
}

