import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrap-move-functions";
import { confirmPenaltyCard } from "./confirm-penalty-card";
import { moveCard } from "./move-card";

export const allFuncs = {
    confirmPenaltyCard,
    moveCard,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
