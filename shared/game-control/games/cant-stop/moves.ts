import { ClientMoveFunctions } from "../../move-fn.js";
import { roll } from "./roll.js";
import { stopRolling } from "./stop-rolling.js";

export const moves = {
    roll,
    stopRolling,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;