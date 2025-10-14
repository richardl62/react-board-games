import { SpecifiedValues } from "../../app/option-specification/types";

export const setupOptions = {
    enableHighScoringWords: {
        default: false,
        label: "Enable high scoring words",
    },
} as const;

export type SetupOptions = SpecifiedValues<typeof setupOptions>;