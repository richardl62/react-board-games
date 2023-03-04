import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

export function setCount(G: ServerData, _ctx: Ctx, count: number): void {
    G.count = count;
    console.log(`Count set to ${count} at ${Date().toLocaleString()}`);
}
