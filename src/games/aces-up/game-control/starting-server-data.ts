import { Ctx } from "boardgame.io";
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
        res.discards[2] = [{rank: "K", suit: "C"}, {rank: "K", suit: "D"},
            {rank: "K", suit: "H"}, {rank: "K", suit: "S"} ];
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
        // Exclude kings from start cards.
        let card;
        do {
            card = handDeck.draw();
        } while(card.rank === "K");

        sd.sharedPiles.push(makeSharedPile(card));
    }

    // TEMPORARY: To help with testing, push a king
    sd.sharedPiles.push(makeSharedPile({ rank: "K", suit: "C" }));

    sd.sharedPiles.push({top: null, rank: null});

    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck);
    }

    return sd;
}
