import { Ctx } from "../../../ctx.js";
import { PlayerID } from "../../../playerid.js";
import { handSize } from "../config.js";
import { ExtendingDeck } from "../misc/extendable-deck.js";
import { ServerData } from "../server-data.js";
import { turnStartServerData } from "../misc/starting-server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { makeSharedPileData, makeSharedPiles } from "../misc/shared-pile.js";
import { makeDiscardPiles } from "./make-discard-pile.js";

function nextPlayerID(ctx: Ctx) {
    return ctx.playOrder[ctx.nextPlayOrderPos()];
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

    // Iterate over all players and all discard piles, resetting them.
    for (const playerID of Object.keys(G.playerData)) {
        const discardPiles = makeDiscardPiles(G, playerID);
        for(const discardPile of discardPiles) {
            discardPile.resetForStartOfRound();
        }
    }

    // Clear any full or empty shared piles.
    const keep = sharedPiles.filter(p => !p.isEmpty && !p.isFull);
    G.sharedPileData = keep.map(p => p.data);
    
    // Add one empty shared pile (to allow aces to be moved)
    G.sharedPileData.push(makeSharedPileData());
            
    events.endTurn();
}
