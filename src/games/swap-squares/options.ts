import { SpecifiedValues } from "../../app/option-specification";

export const setupOptions = {
    numRows: {
        default: 4,
        label: "Number of rows",
        min: 1,
    },
    numColumns: {
        default: 4,
        label: "Number of columns",
        min: 1,
    },
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;