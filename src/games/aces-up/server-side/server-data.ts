import { Ctx } from "boardgame.io";
import { CardNonJoker } from "../../../utils/cards";
import { handSize, mainPileSize, nSharedPilesAtStart } from "./config";
import { ExtendingDeck } from "./extendable-deck";
import { makeSharedPile, SharedPile } from "./shared-pile";

export interface PlayerData {
    /** The pile that the player in trying to get rid of */
    mainPile: CardNonJoker[];

    hand: CardNonJoker[];

    discards: [CardNonJoker[], CardNonJoker[], CardNonJoker[]];
}

type PlayerDataDictionary =  {[playerID: string]: PlayerData }

function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck) : PlayerData {

    return {
        mainPile: mainPileDeck.drawN(mainPileSize),

        hand: handDeck.drawN(handSize),

        discards: [[], [], []],
    };
}

export interface ServerData {
    /** The deck that cards are drawn from */
    deck: CardNonJoker[];

    /** The piles that any play can add to */
    sharedPiles: SharedPile[];

    playerData: PlayerDataDictionary;

    cardAddedToSharedPiles: boolean;

    serverError: string | null;
    serverTimestamp: number;
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
    for(let i = 0; i < nSharedPilesAtStart; ++i) {
        const card = handDeck.draw();
        sd.sharedPiles.push(makeSharedPile(card));
    }

    // TEMPORARY: To help with testing, push a king
    const king : CardNonJoker = {rank: "K", suit: "C"};
    sd.sharedPiles.push(makeSharedPile(king));


    for(const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck);
    }

    return sd;
}



