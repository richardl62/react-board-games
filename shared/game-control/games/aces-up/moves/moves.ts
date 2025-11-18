import { wrapMoveFunctions } from "../../wrapped-move-function.js";
import { ClientMoveFunctions } from "../../../move-fn.js";
import { moveCard } from "./move-card.js";
import { undo } from "./undo.js";

export const allFuncs = {
    moveCard,
    undo,
};

export const moves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
