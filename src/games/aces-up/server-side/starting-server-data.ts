import { Ctx } from "boardgame.io";
import { CardNonJoker } from "../../../utils/cards";
import { handSize, mainPileSize, nSharedPilesAtStart } from "./config";
import { ExtendingDeck } from "./extendable-deck";
import { makeSharedPile } from "./shared-pile";
import { PlayerData, ServerData } from "./server-data";

function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck) : PlayerData {

    return {
        mainPile: mainPileDeck.drawN(mainPileSize),

        hand: handDeck.drawN(handSize),

        discards: [[], [], []],
    };
}


export function startingServerData(ctx: Ctx): ServerData {

    const sd: ServerData = {
        deck: [],
        sharedPiles: [],

        playerData: {},

        cardAddedToSharedPiles: false,

        serverError: null,
        serverTimestamp: 0,
    };

    const mainPileDeck = new ExtendingDeck(ctx, []);
    const handDeck = new ExtendingDeck(ctx, sd.deck);
    for (let i = 0; i < nSharedPilesAtStart; ++i) {
        const card = handDeck.draw();
        sd.sharedPiles.push(makeSharedPile(card));
    }

    // TEMPORARY: To help with testing, push a king
    const king: CardNonJoker = { rank: "K", suit: "C" };
    sd.sharedPiles.push(makeSharedPile(king));


    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck);
    }

    return sd;
}
