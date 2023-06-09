import { OptionSpecifications, SpecifiedValues } from "../../app/option-specification/types";


export const setupOptions : OptionSpecifications = {
    mustBeatPreviousScores: {
        default: true,
        label: "Must beat previous scores",
    },
    manualDiceRolls: {
        default: false,
        label: "Allow manual dice rolls",
        debugOnly: true,
    },
    neverBust: {
        default: false,
        label: "Never bust",
        debugOnly: true,
    },
} as const;

export type SetupOptions = SpecifiedValues<typeof setupOptions>;