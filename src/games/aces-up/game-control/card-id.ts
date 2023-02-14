import { PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";

export type CardID = {
    area: "sharedPiles",
    index: number,
} | {
    area: "playerPile",
    owner: PlayerID,
} | {
    area: "hand",
    owner: PlayerID,
    index: number,
} | {
    area: "discardPiles",
    owner: PlayerID,
    pileIndex: number,
    cardIndex: number | "any", // KLUDGE?: "any" is used when indentify a
        // particular pile  as a drop target.
}

// Cast as unknown value to a CardID, and do a basic sanity check.
export function getCardID(value: unknown) : CardID {
    const cardID = value as CardID;
    sAssert(typeof cardID.area === "string");
    return cardID;
}

