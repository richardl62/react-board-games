import { showDebugOptions } from "../../app/lobby/start-match";
import { OptionSpecifications, SpecifiedValues } from "../../app/option-specification/types";


export const setupOptions : OptionSpecifications = {
    mustBeatPreviousScores: {
        default: true,
        label: "Must beat previous scores",
    },
    neverBust: {
        default: false,
        label: "Never bust",
        showIf: showDebugOptions,
    },
} as const;

export type SetupOptions = SpecifiedValues<typeof setupOptions>;