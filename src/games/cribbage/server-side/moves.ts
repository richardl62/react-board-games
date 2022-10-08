// import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
// import { recordGrid } from "./record-grid";
// import { doneRecordingGrid } from "./done-recording-grid";
// import { setScore } from "./set-score";
// import { setOptions } from "./set-options";
// import { setMakeGridStartTime } from "./set-make-grid-start";
// import { readyToStartGame } from "./starting-game";
// import { readyForNextRound } from "./starting-round";
// import { readyForNewGame } from "./ready-for-new-game";

export const bgioMoves = {
    // setOptions: wrappedMoveFunction(setOptions),
    // readyToStartGame: wrappedMoveFunction(readyToStartGame),
    // readyForNextRound: wrappedMoveFunction(readyForNextRound),
    // setMakeGridStartTime: wrappedMoveFunction(setMakeGridStartTime),
    // recordGrid: wrappedMoveFunction(recordGrid),
    // doneRecordingGrid: wrappedMoveFunction(doneRecordingGrid),
    // setScore: wrappedMoveFunction(setScore),
    // readyForNewGame: wrappedMoveFunction(readyForNewGame),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientMoves {
    // setOptions: ClientFunction<typeof setOptions>;
    // readyToStartGame: ClientFunction<typeof readyToStartGame>;
    // readyForNextRound: ClientFunction<typeof readyForNextRound>;
    // setMakeGridStartTime: ClientFunction<typeof setMakeGridStartTime>;
    // recordGrid: ClientFunction<typeof recordGrid>;
    // doneRecordingGrid: ClientFunction<typeof doneRecordingGrid>;
    // setScore: ClientFunction<typeof setScore>;
    // readyForNewGame: ClientFunction<typeof readyForNewGame>;
}
