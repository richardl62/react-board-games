import { PlayerID } from "../../../boardgame-lib/playerid";
import { sAssert } from "../../../utils/assert";

export type CardID = {
    area: "sharedPiles",
    index: number,
    owner?: undefined,
} | {
    area: "playerPile",
    owner: PlayerID,
} | {
    area: "hand",
    owner: PlayerID,
    index: number,
} | {
    area: "discardPileCard",
    owner: PlayerID,
    pileIndex: number,

    /** low number are at the bottom of the pile, i.e. they were
     * added before higher numbers. (This makes the indices more 
     * stable.) */
    cardIndex: number,
} | {
    area: "discardPileAll", //The whole pile rather than an individual card
    owner: PlayerID,
    pileIndex: number,
} 

// Cast as unknown value to a CardID, and do a basic sanity check.
export function getCardID(value: unknown) : CardID {
    const cardID = value as CardID;
    sAssert(typeof cardID.area === "string");
    return cardID;
}

