import { SetupOptions } from "@game-control/games/scrabble/server-data";
import { assertType, Equal } from "@utils/assert-type";
import { OptionSpecifications, SpecifiedValues } from "../../option-specification/types";

export const setupOptions = {
    allowIllegalWords: {
        default: false,
        label: "Allow illegal words",
        debugOnly: true,
    },
    enableHighScoringWords: {
        default: false,
        label: "Enable high scoring words",
        debugOnly: true,
    },
} as const satisfies OptionSpecifications;

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();