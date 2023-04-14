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