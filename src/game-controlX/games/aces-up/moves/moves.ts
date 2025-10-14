import { ClientMoveFunctions, wrapMoveFunctions } from "@/game-controlX/wrapped-move-function";
import { moveCard } from "./move-card";
import { undo } from "./undo";

export const allFuncs = {
    moveCard,
    undo,
};

export const moves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
