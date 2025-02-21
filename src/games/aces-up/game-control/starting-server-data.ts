import { debugOptions } from "../game-support/debug-options";
import { handSize } from "../game-support/config";
import { GameOptions, OptionWrapper, makeGameOptions } from "../game-support/game-options";
import { ExtendingDeck } from "./extendable-deck";
import { makeSharedPileData } from "./shared-pile";
import { PerTurnServerData, PlayerData, ServerData } from "./server-data";
import { CardNonJoker, ranks, suits } from "../../../utils/cards/types";
import { startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupArg0 } from "../../../boardgame-lib/game";
import { SetupOptions } from "../game-support/setup-options";
import { RandomAPI } from "../../../boardgame-lib/random";
import { makeDiscardPileData } from "./discard-pile";

function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck,
    options: GameOptions) : PlayerData {

    const optionsWrapper = new OptionWrapper(options);
    const notSpecial = (c: CardNonJoker) => !optionsWrapper.isSpecial(c);

    const discards : CardNonJoker[][] = [[], [], []];

    if (debugOptions.prepopulateOrdered) {
        for(const rank of ranks.slice(0,6)) {
            discards[0].push({rank, suit: "C"});
        }
        for(let i = 0; i < 10; i++) {
            discards[1].push({
                rank: "K", 
                suit: suits[i%suits.length],
            });
        }
    } else if (debugOptions.prepopulateRandom) {
        discards[0] = mainPileDeck.drawN(6);
        discards[1] = mainPileDeck.drawN(1);
        discards[2] = [{rank: "K", suit: "C"}, {rank: "K", suit: "D"},
            {rank: "K", suit: "H"}, {rank: "K", suit: "S"} ];
    }

    return {
        mainPile: mainPileDeck.drawN(options.mainPileSize, notSpecial),

        hand: handDeck.drawN(handSize),

        discardPileData: [
            makeDiscardPileData(discards[0]),
            makeDiscardPileData(discards[1]),
            makeDiscardPileData(discards[2]),
        ],
        cardPlayedToSharedPiles: false,
    };
}

export const turnStartServerData: PerTurnServerData = {
    moveToSharedPile: "not done",
    undoItems:[],
};

function makeRandomSharedPile(gameOptions: GameOptions, random: RandomAPI) {
    const options = new OptionWrapper(gameOptions);
    
    const nonSpecialRanks = ranks.filter(rank => 
        !options.isSpecial({rank, suit: "C"/*arbitary*/})
        && rank !== gameOptions.topRank
    );

    const topRankIndex = random.Die(nonSpecialRanks.length) -1;
    const suit = suits[random.Die(suits.length) -1];
    //KLUDGE: Assumes the special ranks have higher index than non-special.
    const cards : CardNonJoker[] = [];
    for(let index = 0; index <= topRankIndex; ++index) {
        const rank = ranks[index];
        cards.push({rank,suit});
    }

    return makeSharedPileData(cards);
}

export function startingServerData({ctx, random}: SetupArg0,
    setupOptions: SetupOptions
): ServerData {
    const options = makeGameOptions(setupOptions);
    const sd: ServerData = {
        deck: [],
        sharedPileData: [],

        playerData: {},

        ...turnStartServerData,

        ...startingRequiredState(),

        options,
    };

    const mainPileDeck = new ExtendingDeck(random, []);
    const handDeck = new ExtendingDeck(random, sd.deck);

    for (let i = 0; i < options.nSharedPilesAtStart; ++i) {
        sd.sharedPileData.push(makeRandomSharedPile(options, random));
    }

    if (debugOptions.prepopulateRandom || debugOptions.prepopulateOrdered) {
        const kc = { rank: "K", suit: "C" } as const;
        sd.sharedPileData.push(makeSharedPileData([kc,kc,kc,kc,kc,kc,kc,kc,]));

    }

    sd.sharedPileData.push(makeSharedPileData([]));

    for (const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck, options);
    }

    return sd;
}
