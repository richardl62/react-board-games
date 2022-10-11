import { Ctx } from "boardgame.io";
import { GameStage, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function donePegging(G: ServerData, ctx: Ctx, arg: void): void {
    G.player0.hand = [...G.player0.fullHand];
    G.player1.hand = [...G.player1.fullHand];
    G.shared.hand = G.box;
    G.box = [];

    G.stage = GameStage.Scoring;
}
