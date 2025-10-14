import { ClientMoveFunctions, wrapMoveFunctions } from "@/game-controlX/wrapped-move-function";
import { add } from "./add";

export const allFuncs = {
    add
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
