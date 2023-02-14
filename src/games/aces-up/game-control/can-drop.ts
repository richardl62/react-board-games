import { sAssert } from "../../../utils/assert";
import { GameContext } from "../game-support/game-context";
import { CardID } from "./card-id";

export function canDrop(
    gameContext: GameContext,
    {to, from}: {to: CardID, from: CardID}
) : boolean {

    if (to.area === "sharedPiles") {
        // To do: Add logic to check that move is valid.
        return true;
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
        // Drops from discard piles to shared piles are allow (subject to normal checks).
        // This case is handled above.
        return false;
    }

    if(to.area === "hand") {
        return from.area === "hand";
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