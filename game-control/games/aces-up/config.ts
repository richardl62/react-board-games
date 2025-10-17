import { assertThrow as sAssert } from "../../utils/assert";

export const handSize = 5;

// Debug options should be set to false in release builds,
// but can be changed to true during testing and development.
export const debugOptions = {
    prepopulateRandom: false,
    prepopulateOrdered: false,
    skipCheckOnAddedToSharedPiles: false,
};

export function debugOptionsInUse(): boolean {
    for (const [, value] of Object.entries(debugOptions)) {
        sAssert(typeof value === "boolean");
        if (value) {
            return true;
        }
    }

    return false;
}
