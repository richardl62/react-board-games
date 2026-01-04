import { sAssert } from "@utils/assert";
import { MatchState } from "./match-state";
import { CardID } from "@game-control/games/aces-up/moves/card-id";

export function canMove(
    matchState: MatchState,
    id: CardID) : boolean {

    // Not this player's turn.
    if (matchState.playerID !== matchState.ctx.currentPlayer) {
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
    if(id.owner !== matchState.playerID) {
        return id.area === "discardPileCard" 
            && matchState.G.options.canUseOpponentsWastePiles;
    }

    if (id.area === "hand") {
        return true;
    }

    if (id.area === "discardPileCard") {
        return true;
    }

    sAssert(false,"Unexpect card id");
}