import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { doneMakingBox } from "./done-making-box";
import { donePegging } from "./done-pegging";
import { drag } from "./drag";
import { newDeal } from "./new-deal";
import { pegClick } from "./peg-click";
import { restartPegging } from "./retart-pegging";
import { showCutCard } from "./show-cut-card";

export const bgioMoves = {
    drag: wrappedMoveFunction(drag),
    doneMakingBox: wrappedMoveFunction(doneMakingBox),
    donePegging: wrappedMoveFunction(donePegging),
    newDeal: wrappedMoveFunction(newDeal),
    pegClick: wrappedMoveFunction(pegClick),
    restartPegging: wrappedMoveFunction(restartPegging),
    showCutCard: wrappedMoveFunction(showCutCard),

};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;

export interface ClientMoves {
    drag: ClientFunction<typeof drag>;
    doneMakingBox: ClientFunction<typeof doneMakingBox>;
    donePegging: ClientFunction<typeof donePegging>;
    newDeal: ClientFunction<typeof newDeal>;
    pegClick: ClientFunction<typeof pegClick>;
    restartPegging: ClientFunction<typeof restartPegging>;
    showCutCard: ClientFunction<typeof showCutCard>;
}
