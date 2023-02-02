import { Ctx } from "boardgame.io";
import { Card } from "../../../utils/cards";
import { Rank } from "../../../utils/cards/types";
import { handSize, mainPileSize } from "./config";
import { ExtendingDeck } from "./extendable-deck";

export interface PlayerData {
    /** The pile that the player in trying to get rid of */
    mainPile: Card[];

    /** The number of kings that have been set aside from the main pile. */
    kings: number;

    hand: Card[];

    discardPiles: [Card[], Card[], Card[]];

    cardPlayedThisTurn: boolean;
}

/** Starting PlayerData but with no cards in mainPile or hand */
function startingPlayerData(mainPileDeck: ExtendingDeck, handDeck: ExtendingDeck) : PlayerData {

    return {
        mainPile: mainPileDeck.draw(mainPileSize),
        kings: 0,

        hand: handDeck.draw(handSize),
        discardPiles: [[], [], []],

        cardPlayedThisTurn: false,
    };
}

/** A shared pile that is build up during play */
interface Pile {
    /** The top card of the pile (others are not recorded) */
    top: Card; 
  
    /** In general, the rank of the card. But if the card is a king, if gives the effective rank */
    rank: Rank;
}

type PlayerDataDictionary =  {[playerID: string]: PlayerData }
export interface ServerData {
    /** The deck that cards are drawn from */
    deck: Card[];

    piles: Pile[];

    playerData: PlayerDataDictionary;

    serverError: string | null;
    serverTimestamp: number;
}

export function startingServerData(ctx: Ctx): ServerData {

    const sd: ServerData = {
        deck: [],
        piles: [],

        playerData: {},

        serverError: null,
        serverTimestamp: 0,
    };

    const mainPileDeck = new ExtendingDeck(ctx, []);
    const handDeck = new ExtendingDeck(ctx, sd.deck);
    for(const pid in ctx.playOrder) {
        sd.playerData[pid] = startingPlayerData(mainPileDeck, handDeck);
    }

    return sd;
}



