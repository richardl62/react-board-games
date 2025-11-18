import { wrapMoveFunctions } from "../wrapped-move-function.js";
import { ClientMoveFunctions } from "../../move-fn.js";
import { add } from "./add.js";

export const allFuncs = {
    add
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
