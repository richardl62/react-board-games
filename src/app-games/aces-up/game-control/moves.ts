import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { moveCard } from "./move-card";
import { undo } from "./undo";

export const allFuncs = {
    moveCard,
    undo,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
