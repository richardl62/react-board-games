import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function doneMakingBox(G: ServerData, ctx: Ctx, arg: void): void {
    sAssert(G.stage === GameStage.SettingBox);
    G.me.fullHand = [...G.me.hand];
    G.pone.fullHand = [...G.pone.hand];

    G.box = G.shared.hand;

    G.shared.hand = [];
    G.stage = GameStage.Pegging;
}
