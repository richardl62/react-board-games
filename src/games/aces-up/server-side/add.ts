import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";


export function add(G: ServerData, ctx: Ctx, value: number): void {
    G.count += value;
    if(G.count < 0) {
        throw new Error("Count is negative (test of error handling)");
    }
}
