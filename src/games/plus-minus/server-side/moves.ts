import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrap-move-functions";
import { add } from "./add";

export const allFuncs = {
    add
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
