import { SpecifiedValues } from "../../app/option-specification/types";


export const setupOptions = {
    scoreToWin: {
        default: 5000,
        label: "Score to win",
    },
    mustBeatPreviousScores: {
        default: true,
        label: "Must beat previous scores",
    },
    alwaysFinishRound: {
        default: true,
        label: "Always finish round",
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