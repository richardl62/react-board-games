import { sAssert } from "../../../utils/assert";
import { GameContext } from "../game-support/game-context";
import { CardID } from "./card-id";

export function canMove(
    gameContext: GameContext,
    id: CardID) : boolean {

    // Not this player's turn.
    if (gameContext.playerID !== gameContext.ctx.currentPlayer) {
        return false;
    }

    if (id.area === "sharedPiles") {
        return false;
    }

    // Player piles can be moved regardless of owner.
    if (id.area === "playerPile") {
        return true;
    }
    
    // Not this player's card. (This is after the sharedPiles
    // test to ensure that an owner is expected)
    if(id.owner !== gameContext.playerID) {
        return id.area === "discardPileCard" 
            && gameContext.G.options.canUseOpponentsWastePiles;
    }

    if (id.area === "hand") {
        return true;
    }

    if (id.area === "discardPileCard") {
        return true;
    }

    sAssert(false,"Unexpect card id");
}