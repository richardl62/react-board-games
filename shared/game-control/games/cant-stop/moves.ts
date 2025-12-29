import { ClientMoveFunctions } from "../../move-fn.js";
import { roll } from "./roll.js";

export const moves = {
    roll
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;