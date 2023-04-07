import { debugOptions, handSize, setupOptions, SetupValues } from "../game-support/config";
import { ExtendingDeck } from "./extendable-deck";
import { makeSharedPile } from "./shared-pile";
import { PerTurnServerData, PlayerData, ServerData } from "./server-data";
import { ranks } from "../../../utils/cards/types";
import { startingRequiredState } from "../../../app-game-support/required-server-data";
import { sAssert } from "../../../utils/assert";
import { asSpecifiedValues } from "../../../app/option-specification/tools";
import { SetupArg0 } from "../../../app-game-support/bgio-types";


function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck,
    options: SetupValues) : PlayerData {

    const res : PlayerData = {
        mainPile: mainPileDeck.drawN(options.mainPileSize, "noKings"),

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


export const turnStartServerData: PerTurnServerData = {
    moveToSharedPile: "pending",
    undoItems:[],
};

export function startingServerData({ctx, random}: SetupArg0, setupData: unknown): ServerData {
    const options = asSpecifiedValues(setupData, setupOptions);
    sAssert(options, "setupData does not have the expected type");

    const sd: ServerData = {
        deck: [],
        sharedPiles: [],

        playerData: {},

        ...turnStartServerData,

        ...startingRequiredState(),
    };

    const mainPileDeck = new ExtendingDeck(random, []);
    const handDeck = new ExtendingDeck(random, sd.deck);


    for (let i = 0; i < options.nSharedPilesAtStart; ++i) {
        const card = handDeck.draw("noKings");
        sd.sharedPiles.push(makeSharedPile(card));
    }

    if(debugOptions.prepopulateRandom || debugOptions.prepopulateOrdered) {
        sd.sharedPiles.push(makeSharedPile({ rank: "K", suit: "C" }));
    }

    sd.sharedPiles.push({cards: null, rank: null});

    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck, options);
    }

    return sd;
}
