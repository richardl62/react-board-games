import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrap-move-functions";
import { moveCard } from "./move-card";

export const allFuncs = {
    moveCard,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
