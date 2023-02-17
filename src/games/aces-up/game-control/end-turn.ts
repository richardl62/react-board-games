import { Ctx, PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { debugOptions, handSize } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";
import { startTurnStatus } from "./starting-server-data";

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

function doEndTurn(
    G: ServerData, 
    ctx: Ctx,
) : void {
    const playerID = ctx.currentPlayer;

    if (!G.status.cardAddedToSharedPiles) {
        const deck = new ExtendingDeck(ctx, G.deck);
        G.playerData[playerID].mainPile.push(deck.draw());
    }

    G.status = startTurnStatus();
    
    const nextPlayerID_ = nextPlayerID(ctx);
        
    refillHand(G, ctx, nextPlayerID_);

    // Clear any full shared piles
    G.sharedPiles = G.sharedPiles.filter(p => p.rank !== "Q");
            
    sAssert(ctx.events);
    ctx.events.endTurn();
}

export function endTurn(
    G: ServerData, 
    ctx: Ctx,
    status?: {penaltyConfirmed: boolean}
) : void {

    if(!G.status.cardAddedToSharedPiles && !status?.penaltyConfirmed
        && !debugOptions.skipPenaltyCardProp) {
        G.status.penaltyConfirmationRequired = true;
    } else {
        doEndTurn(G, ctx);
    }
}