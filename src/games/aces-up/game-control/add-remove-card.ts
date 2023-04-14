import { sAssert } from "../../../utils/assert";
import { CardNonJoker } from "../../../utils/cards";
import { CardID } from "./card-id";
import { ServerData } from "./server-data";
import { SharedPile, makeSharedPile, topCard } from "./shared-pile";

function removeOneCard(cards: CardNonJoker[], index: number) : CardNonJoker{
    const card = cards.splice(index,1)[0];
    sAssert(card);
    return card;
}

function addToSharedPile(sharedPiles: SharedPile[], index: number, card: CardNonJoker) {
    sharedPiles[index].cardsPushedThisRound.push(card);

    // Ensure that the last shared pile is empty. (Having an empty pile allows aces to be
    // moved. )
    // Kludge?: Reply on topCard() returning undefined when given an empty pile.
    if (topCard(sharedPiles.at(-1)!)) {
        sharedPiles.push(makeSharedPile([]));
    }
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
        return topCard(G.sharedPiles[id.index]);
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

    throw new Error("Unexpected card ID");
}

export function removeCard(G: ServerData,  id: CardID) : CardNonJoker {

    if(id.area === "sharedPiles") {
        throw new Error("Cannot remove card from shared pile");
    }

    const playerData = G.playerData[id.owner];
    if(id.area === "hand") {
        return removeOneCard(playerData.hand, id.index);
    }

    if(id.area === "discardPileCard") {
        return removeOneCard(playerData.discards[id.pileIndex], id.cardIndex);
    }

    if(id.area === "playerPile") {
        const card = playerData.mainPile.pop();
        sAssert(card);
        return card;
    }

    throw new Error("Unexpected card ID");
}

export function addCard(G: ServerData,  id: CardID, card: CardNonJoker) : void {

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

    if (id.area === "discardPileAll") {
        playerData.discards[id.pileIndex].push(card);
        return;
    }

    throw new Error("Unexpected card ID");
}
