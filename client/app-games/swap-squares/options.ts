import { assertType, Equal } from "@utils/assert-type";
import { SpecifiedValues } from "../../option-specification/types";
import { SetupOptions, startingOrders } from "@game-control/games/swap-squares/server-data";

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

assertType<Equal<
    SetupOptions, 
    SpecifiedValues<typeof setupOptions>
>>();