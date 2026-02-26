import { SetupOptions } from "@game-control/games/scrabble/server-data";
import { assertType, Equal } from "@utils/assert-type";
import { OptionSpecifications, SpecifiedValues } from "../../option-specification/types";

export const setupOptions = {
    enableHighScoringWords: {
        default: false,
        label: "Enable high scoring words",
    },
} as const satisfies OptionSpecifications;

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();