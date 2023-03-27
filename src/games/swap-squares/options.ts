import { SpecifiedValues } from "../../app/option-specification/types";

export const setupOptions = {
    numRows: {
        label: "Number of rows",
        default: 4,

        min: 1,
    },
    numColumns: {
        label: "Number of columns",
        default: 4,
        min: 1,
    },
    startingOrder: {
        label: "Starting order for numbers",
        default: "backwards",
        options: ["forward", "backwards", "reverse"],
    }
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;