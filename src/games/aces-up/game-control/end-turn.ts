import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { handSize } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";

function nextPlayerID(ctx: Ctx) {
    const nextPlayerPos = (ctx.playOrderPos + 1) % ctx.playOrder.length;
    return ctx.playOrder[nextPlayerPos];
}

export function endTurn(
    G: ServerData,
    ctx: Ctx,
): void 
{
    const playerData = G.playerData[nextPlayerID(ctx)];
    const deck = new ExtendingDeck(ctx, G.deck);

    while(playerData.hand.length < handSize) {
        playerData.hand.push(deck.draw());
    }
    
    sAssert(ctx.events);
    ctx.events.endTurn();
}