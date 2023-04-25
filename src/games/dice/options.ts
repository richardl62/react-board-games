import { SpecifiedValues } from "../../app/option-specification/types";


export const setupOptions = {
    numberOfDice: {
        default: 6,
        label: "Number of dice",
        min: 1,
    },
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;