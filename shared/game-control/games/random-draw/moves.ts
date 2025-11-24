import { ClientMoveFunctions } from "../../move-fn.js";
import { changeValues } from "./change-values.js";

export const moves = {
    changeValues
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;