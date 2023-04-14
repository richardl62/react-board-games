import { Ctx, PlayerID } from "boardgame.io";
import { handSize } from "../game-support/options";
import { ExtendingDeck } from "./extendable-deck";
import { ServerData } from "./server-data";
import { turnStartServerData } from "./starting-server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { rank, resetForStartOfRound } from "./shared-pile";
import { makeWrappedServerData } from "./wrapped-server-data";

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
    const wrappedG = makeWrappedServerData(arg0.G);

    Object.assign(G, turnStartServerData);
    
    const nextPlayerID_ = nextPlayerID(ctx);
        
    refillHand(arg0, nextPlayerID_);


    // Clear any full shared piles (Change G.sharedPiles rather than
    // wrappedG.sharedPiles to ensure change has an effect.)
    G.sharedPiles = G.sharedPiles.filter(p => rank(p) !== wrappedG.topRank);

    for(const sharedPile of G.sharedPiles) {
        resetForStartOfRound(sharedPile);
    }
            
    events.endTurn();
}
