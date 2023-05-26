import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { roll } from "./roll";
import { rollAll } from "./roll-all";
import { setHeld } from "./set-held";

export const allFuncs = {
    roll,
    rollAll: rollAll,
    setHeld,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
