import { sAssert } from "../../../utils/assert";
import { GameContext } from "../game-support/game-context";
import { CardID } from "./card-id";

export function isDraggable(
    gameContext: GameContext,
    id: CardID) : boolean {

    if (id.area === "sharedPiles") {
        return false;
    }

    if(id.owner !== gameContext.ctx.currentPlayer) {
        // Not this players turn.
        return false;
    }

    if (id.area === "playerPile") {
        return true;
    }

    if (id.area === "hand") {
        return true;
    }

    if (id.area === "discardPiles") {
        // Only the top card in the pile can be dragged.
        return id.cardIndex === 0;
    }

    sAssert(false,"Unexpect card id");
}