import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { handSize } from "../game-support/config";
import { addCard, removeCard } from "./add-remove-card";
import { CardID } from "./card-id";
import { ExtendingDeck } from "./extendable-deck";
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

    if(from.area === "hand" && to.area === "hand") {
        sAssert(from.owner === to.owner);
        const hand = G.playerData[from.owner].hand;
        reorderFollowingDrag(hand, from.index, to.index);
        return;
    }

    const card = removeCard(G, from);
    addCard(G, to, card);

    if(to.area === "discardPiles") {
        const playerData = G.playerData[nextPlayerID(ctx)];
        const deck = new ExtendingDeck(ctx, G.deck);
    
        while(playerData.hand.length < handSize) {
            playerData.hand.push(deck.draw());
        }
        
        sAssert(ctx.events);
        ctx.events.endTurn();
    }
}