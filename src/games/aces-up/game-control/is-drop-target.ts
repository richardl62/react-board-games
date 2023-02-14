import { sAssert } from "../../../utils/assert";
import { GameContext } from "../game-support/game-context";
import { CardID } from "./card-id";

export function isDropTarget(
    gameContext: GameContext,
    id: CardID) : boolean {

    if (id.area === "sharedPiles") {
        return true;
    }

    if(id.owner !== gameContext.ctx.currentPlayer) {
        // Not this players turn.
        return false;
    }

    if (id.area === "playerPile") {
        return false;
    }

    if (id.area === "hand") {
        return true; // For now
    }

    if (id.area === "discardPiles") {
        // Dropping is supported on the pile as a whole rather than
        // on individual cards in the pile.
        return id.cardIndex === "any";
    }

    sAssert(false,"Unexpect card id");
}