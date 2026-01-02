import { ClientMoveFunctions } from "../../../move-fn.js";
import { recordScoringChoice } from "./record-dice-roll.js";
import { bust } from "./bust.js";
import { roll } from "./roll.js";
import { stopRolling } from "./stop-rolling.js";

export const moves = {
    recordScoringChoice,
    bust,
    roll,
    stopRolling,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;