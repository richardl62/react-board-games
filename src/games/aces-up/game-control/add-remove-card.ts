import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards";
import { handSize } from "../game-support/config";
import { CardID } from "./card-id";
import { ServerData } from "./server-data";
import { makeSharedPileData, makeSharedPiles, SharedPile } from "./shared-pile";

function removeOneCard(cards: CardNonJoker[], index: number) : CardNonJoker{
    const card = cards.splice(index,1)[0];
    sAssert(card);
    return card;
}

export function emptyPile(G: ServerData,  id: CardID) : boolean {
    if(id.area === "discardPileAll") {
        const playerData = G.playerData[id.owner];
        return playerData.discards[id.pileIndex].length === 0;
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
        return playerData.discards[id.pileIndex][id.cardIndex];
    }

    if(id.area === "playerPile") {
        return playerData.mainPile.at(-1);
    }

    throw new Error("Problem getting cards - unexpected card ID");
}

export function removeCard(G: ServerData,  id: CardID) : CardNonJoker {

    if(id.area === "sharedPiles") {
        const sp = makeSharedPiles(G)[id.index];
        const card = sp.removeTopCard();
        sAssert(card);
        return card;
    }

    const playerData = G.playerData[id.owner];
    if(id.area === "hand") {
        return removeOneCard(playerData.hand, id.index);
    }

    if(id.area === "discardPileCard") {
        return removeOneCard(playerData.discards[id.pileIndex], id.cardIndex);
    }

    if(id.area === "discardPileAll") {
        const card = playerData.discards[id.pileIndex].pop();
        sAssert(card);
        return card;
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
        sharedPiles[id.index].cardsPushedThisRound.push(card);

        // Ensure that the last shared pile is empty. (Having an empty pile allows aces to be
        // moved. )
        // Kludge?: Reply on topCard() returning undefined when given an empty pile.
        if (sharedPiles.at(-1)!.top) {
            G.sharedPileData.push(makeSharedPileData([]));
        }
        return;
    }

    const playerData = G.playerData[id.owner];

    if(id.area === "hand") {
        sAssert(playerData.hand.length < handSize,
            "Cannot at card to full hand");
        playerData.hand.splice(id.index,0,card);
        return;
    }
    
    if(id.area === "playerPile") {
        playerData.mainPile.push(card);
        return;
    }

    if (id.area === "discardPileAll" || id.area === "discardPileCard") {
        playerData.discards[id.pileIndex].push(card);
        return;
    }

    throw new Error("Cannot add card - unexpected card ID");
}

export function clearPile(G: ServerData,  id: CardID) : void {

    if(id.area === "sharedPiles") {
        G.sharedPileData[id.index] = makeSharedPileData();
        return;
    }

    if (id.area === "discardPileAll" || id.area === "discardPileCard") {
        const playerData = G.playerData[id.owner];
        playerData.discards[id.pileIndex] = [];
        return;
    }

    throw new Error("Cannot clear pile");
}
