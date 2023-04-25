import { SpecifiedValues } from "../../app/option-specification/types";


export const setupOptions = {
    startingValue: {
        default: 2,
        label: "Starting value",
        min: 0,
        max: 10,
    },
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;