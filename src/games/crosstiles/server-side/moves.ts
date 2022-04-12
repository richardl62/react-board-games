import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { playerReady, PlayerReadyArg } from "./player-ready";

export const bgioMoves = {
    playerReady: wrappedMoveFunction(playerReady),
};

export interface ClientMoves {
    playerReady: (arg: PlayerReadyArg) => void;
}
