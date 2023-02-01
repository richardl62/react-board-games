import { ClientFunctionsT, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { add } from "./add";

export const allFuncs = {
    add
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientFunctionsT<typeof allFuncs>;
