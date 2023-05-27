import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { roll } from "./roll";
import { rollAll } from "./roll-all";
import { setHeld } from "./set-held";
import { bust, endTurnWithScore } from "./end-turn";

export const allFuncs = {
    bust,
    endTurnWithScore,
    roll,
    rollAll,
    setHeld,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
