import { sAssert } from "../../../utils/assert";
import { SpecifiedValues } from "../../../app-game-support/value-specification";

export const handSize = 5;

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

};

export type SetupValues = SpecifiedValues<typeof setupOptions>;
