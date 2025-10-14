import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { doneRecordingGrid } from "./done-recording-grid";
import { readyForNewGame } from "./ready-for-new-game";
import { recordGrid } from "./record-grid";
import { setMakeGridStartTime } from "./set-make-grid-start";
import { setScore } from "./set-score";
import { readyToStartGame } from "./starting-game";
import { readyForNextRound } from "./starting-round";

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