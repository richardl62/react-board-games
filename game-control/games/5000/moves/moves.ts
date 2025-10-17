import { ClientMoveFunctions, wrapMoveFunctions } from "../../../wrapped-move-function";
import { roll } from "./roll";
import { setHeld } from "./set-held";
import { endTurnBust, endTurnNotBust } from "./end-turn";

export const allFuncs = {
    endTurnBust,
    endTurnNotBust,
    roll,
    setHeld,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
