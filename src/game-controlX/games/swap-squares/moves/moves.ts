import { ClientMoveFunctions, wrapMoveFunctions } from "@/game-controlX/wrapped-move-function";
import { swap } from "./swap";
import { reset } from "./reset";

export const allFuncs = {
    swap,
    reset,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
