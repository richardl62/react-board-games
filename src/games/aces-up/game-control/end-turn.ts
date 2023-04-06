import { Ctx, PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { handSize } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";
import { turnStartServerData } from "./starting-server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

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
    {G, ctx, events} : MoveArg0<ServerData>, 
) : void {

    Object.assign(G, turnStartServerData);
    
    const nextPlayerID_ = nextPlayerID(ctx);
        
    refillHand(G, ctx, nextPlayerID_);

    // Clear any full shared piles
    G.sharedPiles = G.sharedPiles.filter(p => p.rank !== "Q");

    // Clear all but the top card of shared piles (so only the
    // cards played in the current turn are shown)
    for(const sharedPile of G.sharedPiles) {
        if(sharedPile.cards) {
            sAssert(sharedPile.cards.length > 0);
            sharedPile.cards = sharedPile.cards.slice(-1); // The last element
        }
    }
            
    events.endTurn();
}
