import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
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
