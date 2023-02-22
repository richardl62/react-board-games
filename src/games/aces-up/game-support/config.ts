import { sAssert } from "../../../utils/assert";

export const handSize = 5;

/** The initial size of the main piles, i.e. the cards that players
 * want to get rid of */
export const mainPileSize = 24;

export const nSharedPilesAtStart = 3;

// The debug iptions should be set to false for normal play.
export const debugOptions = {
    prepopulateRandom: false,
    prepopulateOrdered: false, // Takes precedence over prepopulateRandom
    skipCheckOnAddedToSharedPiles: false,
    skipRequirementToAddToSharedPiles: false,
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