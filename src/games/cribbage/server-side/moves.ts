import { ClientFunctionsT, wrappedMoveFunctions } from "../../../app-game-support/wrapped-move-function";
import { doneMakingBox } from "./done-making-box";
import { drag } from "./drag";
import { pegClick } from "./peg-click";
import { requestNewDeal } from "./request-new-deal";
import { requestRestartPegging } from "./request-restart-pegging";
import { requestRevealHands } from "./request-reveal-hands";
import { showCutCard } from "./show-cut-card";

export const allFuncs = {
    doneMakingBox,
    drag,
    pegClick,
    requestNewDeal,
    requestRestartPegging,
    requestRevealHands,
    showCutCard,
};

export const bgioMoves = wrappedMoveFunctions(allFuncs);

export type ClientMoves = ClientFunctionsT<typeof allFuncs>;
