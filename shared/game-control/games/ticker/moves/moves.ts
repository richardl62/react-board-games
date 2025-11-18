import { ClientMoveFunctions } from "../../../move-fn.js";
import { incrementCount } from "./increment-count.js";
import { throwError } from "./throw-error.js";

export const moves = {
    incrementCount,
    throwError,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;
