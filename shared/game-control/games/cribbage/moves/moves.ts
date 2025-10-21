import { ClientMoveFunctions, wrapMoveFunctions } from "../../../wrapped-move-function.js";
import { doneMakingBox } from "./done-making-box.js";
import { drag } from "./drag.js";
import { pegClick } from "./peg-click.js";
import { requestNewDeal } from "./request-new-deal.js";
import { requestRestartPegging } from "./request-restart-pegging.js";
import { requestRevealHands } from "./request-reveal-hands.js";
import { showCutCard } from "./show-cut-card.js";

export const allFuncs = {
    doneMakingBox,
    drag,
    pegClick,
    requestNewDeal,
    requestRestartPegging,
    requestRevealHands,
    showCutCard,
};

export const bgioMoves = wrapMoveFunctions(allFuncs);

export type ClientMoves = ClientMoveFunctions<typeof allFuncs>;
