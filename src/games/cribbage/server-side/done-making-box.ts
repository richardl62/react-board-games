import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function doneMakingBox(G: ServerData, ctx: Ctx, arg: void): void {
    sAssert(G.stage === GameStage.SettingBox);
    G.player0.fullHand = [...G.player0.hand];
    G.player1.fullHand = [...G.player1.hand];

    G.box = G.shared.hand;

    G.shared.hand = [];
    G.stage = GameStage.Pegging;
}