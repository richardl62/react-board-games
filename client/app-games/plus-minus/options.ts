import { SetupOptions } from "@game-control/games/plus-minus/server-data";
import { assertType, Equal } from "@utils/assert-type";
import { OptionSpecifications, SpecifiedValues } from "../../option-specification/types";

export const setupOptions = {
    startingValue: {
        default: 0,
        label: "Starting value",
        min: 0,
        max: 10,
    },
} as const satisfies OptionSpecifications;

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();