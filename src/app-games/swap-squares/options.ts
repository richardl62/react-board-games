import { SpecifiedValues } from "../../app/option-specification/types";
import { startingOrders } from "./server-side/server-data";

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
        default: "forward",
        options: startingOrders,
    }
} as const;

export type SetupOptions = SpecifiedValues<typeof setupOptions>;