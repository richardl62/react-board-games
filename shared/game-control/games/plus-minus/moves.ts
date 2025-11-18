import { ClientMoveFunctions } from "../../move-fn.js";
import { add } from "./add.js";

export const moves = {
    add
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;