import { ClientMoveFunctions } from "../../../move-fn.js";
import { roll } from "./roll.js";
import { setHeld } from "./set-held.js";
import { endTurnBust, endTurnNotBust } from "./end-turn.js";

export const moves = {
    endTurnBust,
    endTurnNotBust,
    roll,
    setHeld,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;
