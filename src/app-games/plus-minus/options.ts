import { SetupOptions } from "@game-control/games/plus-minus/server-data";
import { assertType, Equal } from "@utils/assert-type";
import { SpecifiedValues } from "../../option-specification/types";

export const setupOptions = {
    startingValue: {
        default: 2,
        label: "Starting value",
        min: 0,
        max: 10,
    },
} as const;

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();