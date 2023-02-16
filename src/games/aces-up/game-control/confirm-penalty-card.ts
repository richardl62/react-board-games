import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { endTurn } from "./end-turn";
import { ServerData } from "./server-data";

export function confirmPenaltyCard(
    G: ServerData, 
    ctx: Ctx,
    _arg: void 
): void {
    sAssert(G.status.penaltyConfirmationRequired);
    endTurn(G, ctx, {penaltyConfirmed: true});
}