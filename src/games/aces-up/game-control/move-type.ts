import { sAssert } from "../../../utils/assert";
import { CardNonJoker, nextRank } from "../../../utils/cards/types";
import { debugOptions } from "../game-support/config";
import { emptyPile, getCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { SharedPile, rank } from "./shared-pile";
import { ServerData } from "./server-data";
import { OptionWrapper } from "../game-support/game-options";
import { Ctx, PlayerID } from "boardgame.io";

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

function isPlayersDiscardPile(playerID: PlayerID, cardID: CardID) {
    return (cardID.area === "discardPileAll" || cardID.area === "discardPileCard")
        && cardID.owner === playerID;
}

type MoveType = "move" | "steal" | "clear" | null;

export function moveType(
    {G, ctx, playerID}: {G: ServerData, ctx: Ctx, playerID: PlayerID},
    {to, from}: {to: CardID, from: CardID}
) : MoveType {
    const options = new OptionWrapper(G.options);
    
    const fromCard = getCard(G, from);
    sAssert(fromCard);


    if ( options.isThief(fromCard) || options.isKiller(fromCard)) {
        if ( isPlayersDiscardPile(playerID, to) ) {
            return "move";
        }

        if ( to.area === "hand" ) {
            return to.owner === playerID ? "move" : null;
        }

        if ( emptyPile(G, to) ) {
            return null;
        }

        if (to.area === "playerPile") {
            if (options.isThief(fromCard) && to.owner !== playerID) {
                // Players can't steal from there own player piles
                return "steal";
            }

            return null;
        }

        if(options.isKiller(fromCard)) {
            return "clear";
        } 

        if(options.isThief(fromCard)) {
            return "steal";
        } 

        sAssert(false);
    }

    if (to.area === "sharedPiles") {
        if(from.area === "discardPileCard") {
            const fromPile = G.playerData[from.owner].discards[from.pileIndex];
            if(from.cardIndex !== fromPile.length-1) {
                return null;
            }
        }

        const toPile = G.sharedPiles[to.index];

        return moveableToSharedPile(G, fromCard, toPile) ? "move" : null;
    }

    if (from.area === "sharedPiles") {
        return null;
    }

    if(to.owner !== ctx.currentPlayer) {
        return null;
    }

    if(from.owner !== ctx.currentPlayer) {
        return null;
    }

    if(from.area === "discardPileCard") {
        // Drops from discard piles to shared piles are handled above.
        // This case is for drops from one discard pile to another
        return to.area === "discardPileAll"
            && from.pileIndex !== to.pileIndex ? "move" : null;
    }

    if(to.area === "hand") {
        return from.area === "hand" &&
            from.index !== to.index ? "move" : null;
    }

    if (to.area === "playerPile") {
        return null;
    }

    if (to.area === "discardPileAll") {
        // Dropping is supported on the pile as a whole rather than
        // on individual cards in the pile.
        return from.area === "hand" ? "move" : null;
    }

    if (to.area === "discardPileCard") {
        // Dropping is supported on the pile as a whole rather than
        // on individual cards in the pile.
        return null;
    }


    sAssert(false, "Cannot determine if drop is permissable");
}

