import { SpecifiedValues } from "../../option-specification/types";
import { assertType, Equal } from "@utils/assert-type";
import { SetupOptions } from "@game-control/games/cant-stop/server-data";

export const setupOptions = {
    minClearanceAbove: {
        default: 1,
        label: "Min clearance above",
        min: 0,
    }, 
    minClearanceBelow: {
        default: 0,
        label: "Min clearance below",
        min: 0,
    },
} as const

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();