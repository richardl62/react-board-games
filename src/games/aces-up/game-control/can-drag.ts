import { sAssert } from "../../../utils/assert";
import { GameContext } from "../game-support/game-context";
import { CardID } from "./card-id";

export function canDrag(
    gameContext: GameContext,
    id: CardID) : boolean {

    if (id.area === "sharedPiles") {
        return false;
    }

    if(id.owner !== gameContext.playerID && id.area !== "playerPile") {
        // Not this players card.
        return false;
    }

    if(gameContext.playerID !== gameContext.ctx.currentPlayer) {
        // Not this players turn.
        return false;
    }

    if (id.area === "playerPile") {
        return true;
    }

    if (id.area === "hand") {
        return true;
    }

    if (id.area === "discardPileCard") {
        return true;
    }

    sAssert(false,"Unexpect card id");
}