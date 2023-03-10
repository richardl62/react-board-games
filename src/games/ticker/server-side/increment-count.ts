import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

export function incrementCount(G: ServerData, _ctx: Ctx, _arg: void): void {
    G.count++;
    console.log(`Count set to ${G.count} at ${Date().toLocaleString()}`);
}
