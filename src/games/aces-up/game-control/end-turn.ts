import { Ctx, PlayerID } from "boardgame.io";
import { handSize } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";
import { turnStartServerData } from "./starting-server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { makeSharedPile, makeSharedPileData } from "./shared-pile";

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
    let sharedPiles = G.sharedPileData.map(makeSharedPile);

    Object.assign(G, turnStartServerData);
    
    const nextPlayerID_ = nextPlayerID(ctx);
        
    refillHand(arg0, nextPlayerID_);


    for(const sharedPile of sharedPiles) {
        sharedPile.resetForStartOfRound();
    }

    // Clear any full or empty shared piles, then add a new empty one.
    sharedPiles = sharedPiles.filter(p => {
        const rank = p.topCard?.rank;
        return rank !== G.options.topRank && rank !== null;
    });
    G.sharedPileData = sharedPiles.map(p => p.data);
    G.sharedPileData.push(makeSharedPileData());
            
    events.endTurn();
}
