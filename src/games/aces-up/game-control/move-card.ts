import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { CardID } from "./card-id";
import { endTurn } from "./end-turn";
import { ServerData } from "./server-data";
import { nextRank, SharedPile } from "./shared-pile";

function removeOneCard(cards: CardNonJoker[], index: number) : CardNonJoker{
    const card = cards.splice(index,1)[0];
    sAssert(card);
    return card;
}

function addToSharedPile(sharedPiles: SharedPile[], index: number, card: CardNonJoker) {
    const sp = sharedPiles[index];

    const newRank = card.rank === "K" ? nextRank(sp) : null;
    sp.top = card;
    sp.rank = newRank;

    // Ensure that the last shared pile is empty. (Having an empty pile allows aces to be
    // moved. )
    if(sharedPiles[sharedPiles.length-1].top !== null) {
        sharedPiles.push({top: null, rank: null});
    }
}

function removeCard(G: ServerData,  id: CardID) : CardNonJoker {

    if(id.area === "sharedPiles") {
        throw new Error("Cannot remove card from shared pile");
    }

    const playerData = G.playerData[id.owner];
    if(id.area === "hand") {
        return removeOneCard(playerData.hand, id.index);
    }

    if(id.area === "discardPiles") {
        sAssert(id.cardIndex !== "any");
        return removeOneCard(playerData.discards[id.pileIndex], id.cardIndex);
    }

    if(id.area === "playerPile") {
        return removeOneCard(playerData.mainPile, 0);
    }

    throw new Error("Unexpected card ID");
}

function addCard(G: ServerData,  id: CardID, card: CardNonJoker) {

    if(id.area === "sharedPiles") {
        addToSharedPile(G.sharedPiles, id.index, card);
        return;
    }

    if(id.area === "playerPile") {
        throw new Error("Cannot add card to players piles");
    }

    if(id.area === "hand") {
        throw new Error("Cannot add card to players hand");
    }

    const playerData = G.playerData[id.owner];

    if (id.area === "discardPiles") {
        playerData.discards[id.pileIndex].unshift(card);
        return;
    }

    throw new Error("Unexpected card ID");
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
        endTurn(G, ctx);
    }
}