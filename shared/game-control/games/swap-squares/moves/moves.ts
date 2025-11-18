import { ClientMoveFunctions } from "../../../move-fn.js";
import { swap } from "./swap.js";
import { reset } from "./reset.js";

export const moves = {
    swap,
    reset,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;
