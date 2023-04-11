import { SpecifiedValues } from "../../../app/option-specification/types";
import { sAssert } from "../../../utils/assert";

export const handSize = 5;

// The debug iptions should be set to false for normal play.
export const debugOptions = {
    prepopulateRandom: false,
    prepopulateOrdered: false,
    skipCheckOnAddedToSharedPiles: false,
};

export function debugOptionsInUse() : boolean {
    for (const [, value] of Object.entries(debugOptions)) {
        sAssert(typeof value === "boolean");
        if(value) {
            return true;
        }
    }

    return false;
}

export const setupOptions = {
    mainPileSize: {
        label: "Size of players' piles",
        default: 24,
        min: 1,
    },
    nSharedPilesAtStart: {
        label: "No of shared piles at start",
        default: 3,
        min: 0,
    },
    addToSharedPileEachTurn: {
        label: "Must add to shared pile each turn",
        default: true,
    },
    canUseOpponentsWastePiles: {
        label: "Can use opponents waste piles",
        default: false,
    },
    jacksAndQueensSpecial: {
        label: "Jacks and queens special",
        default: false,
    }
};

export type GameOptions = SpecifiedValues<typeof setupOptions>;
