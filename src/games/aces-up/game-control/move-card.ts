import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { addCard, removeCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { endTurn, refillHand } from "./end-turn";
import { ServerData } from "./server-data";

function nextPlayerID(ctx: Ctx) {
    const nextPlayerPos = (ctx.playOrderPos + 1) % ctx.playOrder.length;
    return ctx.playOrder[nextPlayerPos];
}

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

    const card = removeCard(G, from);
    addCard(G, to, card);

    if(to.area === "discardPiles") {
        endTurn(G, ctx);
    } else {
        if (playerData.hand.length === 0) {
            refillHand(G, ctx, nextPlayerID(ctx));
        }

        if (to.area === "sharedPiles") {
            G.cardAddedToSharedPiles = true;
        }
    }
}