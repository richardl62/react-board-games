import { ClientMoveFunctions } from "../../../move-fn.js";
import { recordScoringChoice } from "./record-scoring-choice.js";
import { acknowledgeBust } from "./acknowledge-bust.js";
import { roll } from "./roll.js";
import { stopRolling } from "./stop-rolling.js";

export const moves = {
    recordScoringChoice,
    acknowledgeBust,
    roll,
    stopRolling,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;