import { sAssert } from "../../../utils/assert";
import { CardNonJoker, nextRank } from "../../../utils/cards/types";
import { debugOptions } from "../game-support/debug-options";
import { emptyPile, getCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { SharedPile, makeSharedPiles } from "./shared-pile";
import { ServerData } from "./server-data";
import { GameOptions, OptionWrapper } from "../game-support/game-options";
import { Ctx } from "../../../boardgame-lib/ctx";
import { PlayerID } from "../../../boardgame-lib/playerid";
import { makeDiscardPile } from "./make-discard-pile";

export function moveableToSharedPile(
    options: GameOptions,
    card: CardNonJoker, 
    pile: SharedPile
) : boolean {

    if(debugOptions.skipCheckOnAddedToSharedPiles) {
        return true;
    }

    if(pile.rank === options.topRank) {
        // You can't add to a full pile
        return false;
    } 
    
    return card.rank === "K" || card.rank === nextRank(pile.rank);
}

type MoveType = "move" | "steal" | "clear" | null;

export function moveType(
    {G, playerID}: {G: ServerData, ctx: Ctx, playerID: PlayerID},
    {to, from}: {to: CardID, from: CardID}
) : MoveType {
    const options = new OptionWrapper(G.options);
    
    const fromCard = getCard(G, from);
    sAssert(fromCard);

    const isCurrentPlayer = (card: CardID) => card.owner === playerID;
    const isDiscardPile = (card: CardID) => card.area === "discardPileAll" ||
        card.area === "discardPileCard";

    const discardPileIndex = (card: CardID) => {
        sAssert(card.area === "discardPileAll" || card.area === "discardPileCard");
        return card.pileIndex;
    };

    // Move within a hand
    if ( to.area === "hand" && from.area === "hand" ) {
        sAssert(isCurrentPlayer(to) && isCurrentPlayer(from));
        return "move";
    }

    // Move from players hand to their discard area.  This is a simple
    // move even for special cards.
    if ( to.area === "discardPileAll" && from.area === "hand"
            && isCurrentPlayer(to) && isCurrentPlayer(from)) {
        return "move";
    }

    if ( options.isThief(fromCard)) {
        // Can't steal empty piles
        if ( emptyPile(G, to) ) {
            return null;
        }

        // Players can't steal from their own player piles
        if (to.area === "playerPile" && isCurrentPlayer(to)) {
            return null;
        }

        return "steal";
    }

    if ( options.isKiller(fromCard)) {
        // Can't clear empty piles
        if ( emptyPile(G, to) ) {
            return null;
        }

        // Can't clear player piles
        if (to.area === "playerPile") {
            return null;
        }

        return "clear";
    }

    // Moves within a players own discard piles are permitted even if it
    // is not the top of a pile that is being moved.
    if (isDiscardPile(from) && isDiscardPile(to)) {
        return isCurrentPlayer(from) && isCurrentPlayer(to) &&
            discardPileIndex(from) !== discardPileIndex(to) ? "move" : null;
    }

    // With the exception above, only the top card of a discard pile can be moved.
    if(from.area === "discardPileCard") {
        const fromPile = makeDiscardPile(G, from.owner, from.pileIndex);
        if (from.cardIndex !== fromPile.length - 1) {
            // Not the top of the pile.
            return null;
        }
    }

    // With the expections handled above, a move to discard pile must be from the 
    // hand of the same player.
    if(isDiscardPile(to)) {
        return from.area === "hand" && isCurrentPlayer(from) && isCurrentPlayer(to) ?
            "move" : null;
    }
    
    // With the expection of moves within a hand, which are handled above, moves
    // to a hand are not allowed.
    if ( to.area === "hand" ) {
        return null;
    }

    // With the expection special cards, which are handled above, cards cannot
    // be moved to a player pile.
    if ( to.area === "playerPile") {
        return null;
    }

    // With the expection special cards, which are handled above, only cards of the
    // correct rank can be moved to a player pile.
    if (to.area === "sharedPiles") {
        const toPile = makeSharedPiles(G)[to.index];
        return moveableToSharedPile(G.options, fromCard, toPile) ? "move" : null;
    }

    sAssert(false, "Cannot determine if drop is permissable");
}

