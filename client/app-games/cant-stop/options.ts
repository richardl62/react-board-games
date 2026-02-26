import { OptionSpecifications, SpecifiedValues } from "../../option-specification/types";
import { assertType, Equal } from "@utils/assert-type";
import { SetupOptions } from "@game-control/games/cant-stop/server-data";

export const setupOptions = {
    minClearanceAbove: {
        default: 0,
        label: "Min clearance above",
        min: 0,
    }, 
    minClearanceBelow: {
        default: 0,
        label: "Min clearance below",
        min: 0,
    },
    // For test purposes it can help to partially fill columns from the start.
    partiallyFillAtStart: {
        default: true, // TEMPORARY - to help with debugging
        label: "Fill column at start",
        debugOnly: true,
    },
} as const satisfies OptionSpecifications;


assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();