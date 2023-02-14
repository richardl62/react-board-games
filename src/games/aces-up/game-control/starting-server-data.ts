import { Ctx } from "boardgame.io";
import { CardNonJoker } from "../../../utils/cards";
import { handSize, mainPileSize, nSharedPilesAtStart } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { makeSharedPile } from "./shared-pile";
import { PlayerData, ServerData } from "./server-data";

const prepopulateDiscards = true;

function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck) : PlayerData {

    const res : PlayerData = {
        mainPile: mainPileDeck.drawN(mainPileSize),

        hand: handDeck.drawN(handSize),

        discards: [[], [], []],
    };

    if (prepopulateDiscards) {
        res.discards[0] = mainPileDeck.drawN(12);
        res.discards[1] = mainPileDeck.drawN(5);
        res.discards[2] = [{rank: "A", suit: "C"}, {rank: "2", suit: "C"}];
    }

    return res;
}


export function startingServerData(ctx: Ctx): ServerData {

    const sd: ServerData = {
        deck: [],
        sharedPiles: [],

        playerData: {},

        cardAddedToSharedPiles: false,
        
        message: "Test message",

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

    sd.sharedPiles.push({top: null, rank: null});

    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck);
    }

    return sd;
}
