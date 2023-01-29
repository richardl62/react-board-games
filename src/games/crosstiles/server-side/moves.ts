import { ClientFunction, wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { recordGrid } from "./record-grid";
import { doneRecordingGrid } from "./done-recording-grid";
import { setScore } from "./set-score";
import { setOptions } from "./set-options";
import { setMakeGridStartTime } from "./set-make-grid-start";
import { readyToStartGame } from "./starting-game";
import { readyForNextRound } from "./starting-round";
import { readyForNewGame } from "./ready-for-new-game";

export const bgioMoves = {
    setOptions: wrappedMoveFunction(setOptions),
    readyToStartGame: wrappedMoveFunction(readyToStartGame),
    readyForNextRound: wrappedMoveFunction(readyForNextRound),
    setMakeGridStartTime: wrappedMoveFunction(setMakeGridStartTime),
    recordGrid: wrappedMoveFunction(recordGrid),
    doneRecordingGrid: wrappedMoveFunction(doneRecordingGrid),
    setScore: wrappedMoveFunction(setScore),
    readyForNewGame: wrappedMoveFunction(readyForNewGame),
};

export interface ClientMoves {
    setOptions: ClientFunction<typeof setOptions>;
    readyToStartGame: ClientFunction<typeof readyToStartGame>;
    readyForNextRound: ClientFunction<typeof readyForNextRound>;
    setMakeGridStartTime: ClientFunction<typeof setMakeGridStartTime>;
    recordGrid: ClientFunction<typeof recordGrid>;
    doneRecordingGrid: ClientFunction<typeof doneRecordingGrid>;
    setScore: ClientFunction<typeof setScore>;
    readyForNewGame: ClientFunction<typeof readyForNewGame>;
}
