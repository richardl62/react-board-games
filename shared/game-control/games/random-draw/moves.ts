import { ClientMoveFunctions } from "../../move-fn.js";
import { draw } from "./draw.js";
import { throwError } from "./throw-error.js";

export const moves = {
    draw, throwError
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;