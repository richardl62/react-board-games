import { wrapMoveFunctions } from "../../wrapped-move-function.js";
import { ClientMoveFunctions } from "../../../move-fn.js";
import { incrementCount } from "./increment-count.js";
import { throwError } from "./throw-error.js";

export const allFuncs = {
    incrementCount,
    throwError,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
