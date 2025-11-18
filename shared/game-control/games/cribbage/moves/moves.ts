import { ClientMoveFunctions } from "../../../move-fn.js";
import { doneMakingBox } from "./done-making-box.js";
import { drag } from "./drag.js";
import { pegClick } from "./peg-click.js";
import { requestNewDeal } from "./request-new-deal.js";
import { requestRestartPegging } from "./request-restart-pegging.js";
import { requestRevealHands } from "./request-reveal-hands.js";
import { showCutCard } from "./show-cut-card.js";

export const moves = {
    doneMakingBox,
    drag,
    pegClick,
    requestNewDeal,
    requestRestartPegging,
    requestRevealHands,
    showCutCard,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;
