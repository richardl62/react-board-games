import { SetupOptions } from "@game-control/games/scrabble/server-data";
import { assertType, Equal } from "@utils/assert-type";
import { SpecifiedValues } from "../../app/option-specification/types";

export const setupOptions = {
    enableHighScoringWords: {
        default: false,
        label: "Enable high scoring words",
    },
} as const;

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();