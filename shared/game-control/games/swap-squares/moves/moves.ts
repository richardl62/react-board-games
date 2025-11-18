import { wrapMoveFunctions } from "../../wrapped-move-function.js";
import { ClientMoveFunctions } from "../../../move-fn.js";
import { swap } from "./swap.js";
import { reset } from "./reset.js";

export const allFuncs = {
    swap,
    reset,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
