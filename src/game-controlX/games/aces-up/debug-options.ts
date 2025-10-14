import { sAssert } from "../../../utils/assert";

// The debug options should be set to false for normal play.
// *** These options don't seem to be changed anyway.  Are they needed? 
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