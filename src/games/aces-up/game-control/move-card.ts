import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { debugOptions } from "../game-support/config";
import { addCard, removeCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { cardsMovableToSharedPile } from "./cards-movable-to-shared-pile";
import { endTurn, refillHand } from "./end-turn";
import { ServerData } from "./server-data";

export function moveCard(
    G: ServerData, 
    ctx: Ctx, 
    /** PlayerID is the ID of the play who requested the move */
    {from, to}: {from: CardID, to: CardID},
) : void {
    const playerID = ctx.currentPlayer;
    sAssert(from.area !== "sharedPiles", "Card played from shared piles" );
    sAssert(from.owner === playerID, "Unexpected card owner");
    sAssert(to.area === "sharedPiles" || to.owner === playerID, "Unexpected card owner");
    
    const playerData = G.playerData[playerID];

    if(from.area === "hand" && to.area === "hand") {
        reorderFollowingDrag(playerData.hand, from.index, to.index);
        return;
    }

    if (to.area === "discardPiles" && G.moveToSharedPile !== "done") {
        if(cardsMovableToSharedPile(G, playerID).length !== 0 && 
            !debugOptions.skipRequirementToAddToSharedPiles) {
            G.moveToSharedPile = "required";
            return;
        }
    }

    const card = removeCard(G, from);
    addCard(G, to, card);

    if(to.area === "discardPiles") {
        endTurn(G, ctx);
    } else {
        if (playerData.hand.length === 0) {
            refillHand(G, ctx, playerID);
        }

        if (to.area === "sharedPiles") {
            G.moveToSharedPile = "done";
        }
    }
}