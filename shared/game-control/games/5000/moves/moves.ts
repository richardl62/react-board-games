import { wrapMoveFunctions } from "../../wrapped-move-function.js";
import { ClientMoveFunctions } from "../../../move-fn.js";
import { roll } from "./roll.js";
import { setHeld } from "./set-held.js";
import { endTurnBust, endTurnNotBust } from "./end-turn.js";

export const allFuncs = {
    endTurnBust,
    endTurnNotBust,
    roll,
    setHeld,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
