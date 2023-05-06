import { Ctx, PlayerID } from "boardgame.io";
import { handSize } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";
import { turnStartServerData } from "./starting-server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { makeSharedPileData, makeSharedPiles } from "./shared-pile";

function nextPlayerID(ctx: Ctx) {
    const nextPlayerPos = (ctx.playOrderPos + 1) % ctx.playOrder.length;
    return ctx.playOrder[nextPlayerPos];
}

export function refillHand({ G, random }: MoveArg0<ServerData>, playerID: PlayerID) : void {
    const playerData = G.playerData[playerID];
    const deck = new ExtendingDeck(random, G.deck);

    while(playerData.hand.length < handSize) {
        playerData.hand.push(deck.draw());
    }
}

export function endTurn(
    arg0 : MoveArg0<ServerData>, 
) : void {
    const {ctx, G, events} = arg0;
    const sharedPiles = makeSharedPiles(G);

    Object.assign(G, turnStartServerData);
    
    const nextPlayerID_ = nextPlayerID(ctx);
        
    refillHand(arg0, nextPlayerID_);

    for(const sharedPile of sharedPiles) {
        sharedPile.resetForStartOfRound();
    }

    // Clear any full or empty shared piles.
    const keep = sharedPiles.filter(p => !p.isEmpty && !p.isFull);
    G.sharedPileData = keep.map(p => p.data);
    
    // Add one empty shared pile (to allow aces to be moved)
    G.sharedPileData.push(makeSharedPileData());
            
    events.endTurn();
}
