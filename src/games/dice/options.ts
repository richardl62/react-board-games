import { SpecifiedValues } from "../../app/option-specification/types";


export const setupOptions = {
    mustBeatPreviousScores: {
        default: true,
        label: "Must beat previous scores",
    },
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;