import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { doneMakingBox } from "./done-making-box";
import { revealHands } from "./reveal-hands";
import { drag } from "./drag";
import { newDeal } from "./new-deal";
import { pegClick } from "./peg-click";
import { requestRestartPegging } from "./request-restart-pegging";
import { showCutCard } from "./show-cut-card";

export const bgioMoves = {
    drag: wrappedMoveFunction(drag),
    doneMakingBox: wrappedMoveFunction(doneMakingBox),
    revealHands: wrappedMoveFunction(revealHands),
    newDeal: wrappedMoveFunction(newDeal),
    pegClick: wrappedMoveFunction(pegClick),
    requestRestartPegging: wrappedMoveFunction(requestRestartPegging),
    showCutCard: wrappedMoveFunction(showCutCard),

};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;

export interface ClientMoves {
    drag: ClientFunction<typeof drag>;
    doneMakingBox: ClientFunction<typeof doneMakingBox>;
    revealHands: ClientFunction<typeof revealHands>;
    newDeal: ClientFunction<typeof newDeal>;
    pegClick: ClientFunction<typeof pegClick>;
    requestRestartPegging: ClientFunction<typeof requestRestartPegging>;
    showCutCard: ClientFunction<typeof showCutCard>;
}
