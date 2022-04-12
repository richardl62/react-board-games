import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { playerReady } from "./player-ready";
import { recordGrid } from "./record-grid";

export const bgioMoves = {
    playerReady: wrappedMoveFunction(playerReady),
    recordGrid: wrappedMoveFunction(recordGrid),
};

type PlayerReadyArg = Parameters<typeof playerReady>[2];
type RecordGridParam = Parameters<typeof recordGrid>[2];

export interface ClientMoves {
    playerReady: (arg: PlayerReadyArg) => void;
    recordGrid: (arg: RecordGridParam) => void;
}
