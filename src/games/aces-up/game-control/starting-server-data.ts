import { debugOptions, handSize } from "../game-support/config";
import { GameOptions, OptionWrapper, makeGameOptions } from "../game-support/game-options";
import { ExtendingDeck } from "./extendable-deck";
import { makeRandomSharedPile, makeSharedPile } from "./shared-pile";
import { PerTurnServerData, PlayerData, ServerData } from "./server-data";
import { CardNonJoker, ranks, suits } from "../../../utils/cards/types";
import { startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupArg0 } from "../../../app-game-support/bgio-types";
import { SetupOptions } from "../game-support/setup-options";


function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck,
    options: GameOptions) : PlayerData {

    const optionsWrapper = new OptionWrapper(options);
    const notSpecial = (c: CardNonJoker) => !optionsWrapper.isSpecial(c);

    const res : PlayerData = {
        mainPile: mainPileDeck.drawN(options.mainPileSize, notSpecial),

        hand: handDeck.drawN(handSize),

        discards: [[], [], []],

        cardPlayedToSharedPiles: false,
    };

    if (debugOptions.prepopulateOrdered) {
        for(const rank of ranks.slice(0,6)) {
            res.discards[0].push({rank, suit: "C"});
        }
        for(let i = 0; i < 10; i++) {
            res.discards[1].push({
                rank: "K", 
                suit: suits[i%suits.length],
            });
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
    moveToSharedPile: "not done",
    undoItems:[],
};

export function startingServerData({ctx, random}: SetupArg0,
    setupOptions: SetupOptions
): ServerData {
    const options = makeGameOptions(setupOptions);
    const sd: ServerData = {
        deck: [],
        sharedPiles: [],

        playerData: {},

        ...turnStartServerData,

        ...startingRequiredState(),

        options,
    };

    const mainPileDeck = new ExtendingDeck(random, []);
    const handDeck = new ExtendingDeck(random, sd.deck);


    for (let i = 0; i < options.nSharedPilesAtStart; ++i) {
        sd.sharedPiles.push(makeRandomSharedPile(options, random));
    }

    if (debugOptions.prepopulateRandom || debugOptions.prepopulateOrdered) {
        const kc = { rank: "K", suit: "C" } as const;
        sd.sharedPiles.push(makeSharedPile([kc,kc,kc,kc,kc,kc,kc,kc,]));

    }

    sd.sharedPiles.push(makeSharedPile([]));

    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck, options);
    }

    return sd;
}
