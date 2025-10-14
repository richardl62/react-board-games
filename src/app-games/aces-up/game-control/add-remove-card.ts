import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards";
import { handSize } from "../game-support/config";
import { CardID } from "./card-id";
import { makeDiscardPile } from "./make-discard-pile";
import { ServerData } from "./server-data";
import { makeSharedPileData, makeSharedPiles, SharedPile } from "./shared-pile";

function removeOneCard(cards: CardNonJoker[], index: number) : CardNonJoker{
    const card = cards.splice(index,1)[0];
    sAssert(card);
    return card;
}

export function emptyPile(G: ServerData,  id: CardID) : boolean {
    if(id.area === "discardPileAll") {
        return makeDiscardPile(G, id.owner, id.pileIndex).isEmpty;
    }

    return !getCard(G,id);
}

export function getCard(G: ServerData,  id: CardID) : CardNonJoker | undefined {

    if(id.area === "sharedPiles") {
        const sp = new SharedPile(G.sharedPileData[id.index], G.options);
        return sp.top;
    }

    const playerData = G.playerData[id.owner];
    if(id.area === "hand") {
        return playerData.hand[id.index];
    }

    if(id.area === "discardPileCard") {
        const pile = makeDiscardPile(G, id.owner, id.pileIndex);
        sAssert(pile.length === id.cardIndex + 1, 
            "getCard: unexpected card index in discard pile");
        return pile.topCard;
    }

    if(id.area === "playerPile") {
        return playerData.mainPile.at(-1);
    }

    throw new Error("Problem getting cards - unexpected card ID");
}
export function stealTopCard(G: ServerData,  id: CardID, thiefCard: CardNonJoker) : CardNonJoker {

    if(id.area === "sharedPiles") {
        const sp = makeSharedPiles(G)[id.index];
        return sp.stealTopCard(thiefCard);
    }

    if(id.area === "discardPileCard" || id.area === "discardPileAll") {
        const pile = makeDiscardPile(G, id.owner, id.pileIndex);
        return pile.stealTopCard(thiefCard);
    }

    throw new Error("Problem removing card - unexpected card ID");
}

export function removeCard(G: ServerData,  id: CardID) : CardNonJoker {

    sAssert(id.area !== "sharedPiles", "removeCard: sharedPiles not supported");

    const playerData = G.playerData[id.owner];
    if(id.area === "hand") {
        return removeOneCard(playerData.hand, id.index);
    }

    if(id.area === "discardPileCard") {
        const pile = makeDiscardPile(G, id.owner, id.pileIndex);
        sAssert(pile.length === id.cardIndex + 1,  
            "removeCard: attempt to remove non-top card from discard pile");
        return pile.removeFromTop(1)[0];
    }


    if(id.area === "playerPile") {
        const card = playerData.mainPile.pop();
        sAssert(card);
        return card;
    }

    throw new Error("Problem removing card - unexpected card ID");
}

export function addCard(G: ServerData,  id: CardID, card: CardNonJoker) : void {
    const sharedPiles = makeSharedPiles(G);
    if(id.area === "sharedPiles") {
        sharedPiles[id.index].addStandardCard(card);

        // Ensure that the last shared pile is empty. (Having an empty pile allows aces to be
        // moved. )
        // Kludge?: Reply on topCard() returning undefined when given an empty pile.
        if (!sharedPiles.at(-1)!.isEmpty) {
            G.sharedPileData.push(makeSharedPileData([]));
        }
        return;
    }

    const playerData = G.playerData[id.owner];

    if(id.area === "hand") {
        sAssert(playerData.hand.length < handSize,
            "Cannot add card to full hand");
        playerData.hand.splice(id.index,0,card);
        return;
    }
    
    if(id.area === "playerPile") {
        playerData.mainPile.push(card);
        return;
    }

    if (id.area === "discardPileAll" || id.area === "discardPileCard") {
        const discardPile = makeDiscardPile(G, id.owner, id.pileIndex);
        discardPile.add(card);
        return;
    }

    throw new Error("Cannot add card - unexpected card ID");
}

export function clearPile(G: ServerData,  id: CardID, killerCard: CardNonJoker) : void {

    if(id.area === "sharedPiles") {
        makeSharedPiles(G)[id.index].clear(killerCard);
        return;
    }

    if (id.area === "discardPileAll" || id.area === "discardPileCard") {
        const discardPile = makeDiscardPile(G, id.owner, id.pileIndex);
        discardPile.clear(killerCard);
        return;
    }

    throw new Error("Cannot clear pile");
}
