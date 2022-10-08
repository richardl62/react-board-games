import { Ctx } from "boardgame.io";
import { GameStage, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function donePegging(G: ServerData, ctx: Ctx, arg: void): void {
    G.me.hand = [...G.me.fullHand];
    G.pone.hand = [...G.pone.fullHand];
    G.shared.hand = G.box;
    G.box = [];

    G.stage = GameStage.Scoring;
}
