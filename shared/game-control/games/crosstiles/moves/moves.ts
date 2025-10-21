import { ClientMoveFunctions, wrapMoveFunctions } from "../../../wrapped-move-function.js";
import { doneRecordingGrid } from "./done-recording-grid.js";
import { readyForNewGame } from "./ready-for-new-game.js";
import { recordGrid } from "./record-grid.js";
import { setMakeGridStartTime } from "./set-make-grid-start.js";
import { setScore } from "./set-score.js";
import { readyToStartGame } from "./starting-game.js";
import { readyForNextRound } from "./starting-round.js";

export const allFuncs = {
    doneRecordingGrid,
    readyForNewGame,
    recordGrid,
    setMakeGridStartTime,
    setScore,
    readyToStartGame,
    readyForNextRound,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;