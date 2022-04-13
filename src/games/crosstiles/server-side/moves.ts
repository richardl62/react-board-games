import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { playerReady } from "./player-ready";
import { recordGrid } from "./record-grid";

export const bgioMoves = {
    playerReady: wrappedMoveFunction(playerReady),
    recordGrid: wrappedMoveFunction(recordGrid),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;


export interface ClientMoves {
    playerReady: ClientFunction<typeof playerReady>;
    recordGrid: ClientFunction<typeof recordGrid>;
}
