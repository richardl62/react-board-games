import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards";
import { CardLocation } from "./card-location";
import { PlayerData, ServerData } from "./server-data";


type MoveStatus = "check only" | "move";

class PeekPop {
    constructor(playerData: PlayerData, from: CardLocation) {
        if(from.area === "hand") {
            this.deck = playerData.hand;
            this.index = from.index;
        } else {
            this.deck = [];
            if (from.area === "discardPiles") {
                this.deck = playerData.discards[from.index];
            } 
            
            this.index = this.deck.length - 1;
             
            sAssert(this.index > 0, "Problem accessing deck");
        }
    }
    
    deck: CardNonJoker[];
    index: number;

    peek() : CardNonJoker {
        return this.deck[this.index];
    }

    pop() : CardNonJoker {
        return this.deck.splice(this.index, 1)[0];
    }
}

function moveToSharePiles(G: ServerData, fromAccess: PeekPop, toIndex: number, status: MoveStatus): boolean {
    // To Do: Add check that move is valid.
    if(status === "move") {
        const card = fromAccess.pop();
        G.sharedPiles[toIndex].top = card;
        G.sharedPiles[toIndex].rank = card.rank!;
        G.cardAddedToSharedPiles = true;
    }
    return true;
}

/** Return true if the specified move is legal.  The move is actually made only
 * if status is "move".
 */
function moveCardImpl(
    G: ServerData, 
    ctx: Ctx, 
    {from, to}: {from: CardLocation, to: CardLocation},
    status: MoveStatus,
) : boolean {
    
    const playerData = G.playerData[ctx.currentPlayer];
    sAssert(playerData, "Cannot access player data");

    if(from.area === "sharedPiles") {
        return false;
    } 

    const fromAccess = new PeekPop(playerData, from);

    if(to.area === "sharedPiles") {
        return moveToSharePiles(G, fromAccess, to.index, status);
    } 
    
    if(to.area === "hand") {
        // To do: Consider allowing moving cards within hand
        return false;
    }
    
    if(to.area === "playerPile") {
        return false;
    } 
     
    
    if(to.area === "discardPiles" && from.area === "playerPile") {
        if(status === "move") {
            playerData.discards[to.index].push(fromAccess.pop());
            //To do: Add end turn actions
        }
        return true;
    } 

    return false;
}

export function canMoveCard(
    G: ServerData, 
    ctx: Ctx, 
    {from, to}: {from: CardLocation, to: CardLocation},
) : boolean {
    return moveCardImpl(G, ctx, {from, to}, "check only");
}

export function moveCard(
    G: ServerData, 
    ctx: Ctx, 
    {from, to}: {from: CardLocation, to: CardLocation},
) : void {
    const ok = moveCardImpl(G, ctx, {from, to}, "move");
    if(!ok) {
        console.warn("moveCard failed", "from:", from, "to:", to);
    }
}