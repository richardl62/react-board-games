import { ClientMoveFunctions, wrapMoveFunctions } from "../../../app-game-support/wrap-move-functions";
import { doneRecordingGrid } from "./done-recording-grid";
import { readyForNewGame } from "./ready-for-new-game";
import { recordGrid } from "./record-grid";
import { setMakeGridStartTime } from "./set-make-grid-start";
import { setOptions } from "./set-options";
import { setScore } from "./set-score";
import { readyToStartGame } from "./starting-game";
import { readyForNextRound } from "./starting-round";

export const allFuncs = {
    doneRecordingGrid,
    readyForNewGame,
    recordGrid,
    setMakeGridStartTime,
    setOptions,
    setScore,
    readyToStartGame,
    readyForNextRound,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;