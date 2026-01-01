import { ClientMoveFunctions } from "../../../move-fn.js";
import { addToColumns } from "./add-to-colums.js";
import { bust } from "./bust.js";
import { roll } from "./roll.js";
import { stopRolling } from "./stop-rolling.js";

export const moves = {
    addToColumns,
    bust,
    roll,
    stopRolling,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;