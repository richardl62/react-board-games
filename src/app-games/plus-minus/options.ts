import { StartingOptions } from "@/game-controlX/games/plus-minus/server-data";
import { assertType, Equal } from "@/utils/assert-type";
import { SpecifiedValues } from "../../app/option-specification/types";

export const setupOptions = {
    startingValue: {
        default: 2,
        label: "Starting value",
        min: 0,
        max: 10,
    },
} as const;

export type SetupOptions = SpecifiedValues<typeof setupOptions>;

assertType<Equal<StartingOptions, SetupOptions>>();