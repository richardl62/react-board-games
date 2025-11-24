import { ClientMoveFunctions } from "../../move-fn.js";
import { draw } from "./draw.js";

export const moves = {
    changeValues: draw
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;