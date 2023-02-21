import { Ctx } from "boardgame.io";
import { debugOptions, handSize, mainPileSize, nSharedPilesAtStart } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { makeSharedPile } from "./shared-pile";
import { PlayerData, ServerData } from "./server-data";
import { ranks } from "../../../utils/cards/types";

function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck) : PlayerData {

    const res : PlayerData = {
        mainPile: mainPileDeck.drawN(mainPileSize, "noKings"),

        hand: handDeck.drawN(handSize),

        discards: [[], [], []],

        cardPlayedToSharedPiles: false,
    };

    if (debugOptions.prepopulateOrdered) {
        for(const rank of ranks.slice(0,6)) {
            res.discards[0].push({rank, suit: "C"});
            res.discards[1].push({rank, suit: "D"});
        }
    } else if (debugOptions.prepopulateRandom) {
        res.discards[0] = mainPileDeck.drawN(6);
        res.discards[1] = mainPileDeck.drawN(1);
        res.discards[2] = [{rank: "K", suit: "C"}, {rank: "K", suit: "D"},
            {rank: "K", suit: "H"}, {rank: "K", suit: "S"} ];
    }

    return res;
}

export function startMoveToSharedPile() : ServerData["moveToSharedPile"] {
    return "pending";
}

export function startingServerData(ctx: Ctx): ServerData {

    const sd: ServerData = {
        deck: [],
        sharedPiles: [],

        playerData: {},

        moveToSharedPile: startMoveToSharedPile(),

        serverError: null,
        serverTimestamp: 0,
    };

    const mainPileDeck = new ExtendingDeck(ctx, []);
    const handDeck = new ExtendingDeck(ctx, sd.deck);


    for (let i = 0; i < nSharedPilesAtStart; ++i) {
        const card = handDeck.draw("noKings");
        sd.sharedPiles.push(makeSharedPile(card));
    }

    if(debugOptions.prepopulateRandom || debugOptions.prepopulateOrdered) {
        sd.sharedPiles.push(makeSharedPile({ rank: "K", suit: "C" }));
    }

    sd.sharedPiles.push({top: null, rank: null});

    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck);
    }

    return sd;
}
