import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function restartPegging(G: ServerData, ctx: Ctx, arg: void): void {
    G.shared.hand = [];
}
