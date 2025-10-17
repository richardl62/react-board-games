import { ClientMoveFunctions, wrapMoveFunctions } from "../../../wrapped-move-function";
import { incrementCount } from "./increment-count";
import { throwError } from "./throw-error";

export const allFuncs = {
    incrementCount,
    throwError,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
