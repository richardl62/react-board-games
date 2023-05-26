import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { recordScore } from "./record-score";
import { roll } from "./roll";
import { rollAll } from "./roll-all";
import { setHeld } from "./set-held";
import { turnOver } from "./turn-over";

export const allFuncs = {
    recordScore,
    roll,
    rollAll,
    setHeld,
    turnOver,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
