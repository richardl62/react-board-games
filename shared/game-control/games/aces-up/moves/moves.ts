import { ClientMoveFunctions } from "../../../move-fn.js";
import { moveCard } from "./move-card.js";
import { undo } from "./undo.js";

export const moves = {
    moveCard,
    undo,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;
