import { Ctx, PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { handSize } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";

function nextPlayerID(ctx: Ctx) {
    const nextPlayerPos = (ctx.playOrderPos + 1) % ctx.playOrder.length;
    return ctx.playOrder[nextPlayerPos];
}

export function refillHand(G: ServerData, ctx: Ctx, playerID: PlayerID) : void {
    const playerData = G.playerData[playerID];
    const deck = new ExtendingDeck(ctx, G.deck);

    while(playerData.hand.length < handSize) {
        playerData.hand.push(deck.draw());
    }
}

export function endTurn(
    G: ServerData, 
    ctx: Ctx, 
) : void {
    const playerID = ctx.currentPlayer;
    if(!G.cardAddedToSharedPiles) {
        const deck = new ExtendingDeck(ctx, G.deck);
        G.playerData[playerID].mainPile.push(deck.draw());
        G.message = "Penalty card added";
    }
    G.cardAddedToSharedPiles = false;
    
    const nextPlayerID_ = nextPlayerID(ctx);
        
    refillHand(G, ctx, nextPlayerID_);
            
    sAssert(ctx.events);
    ctx.events.endTurn();
}