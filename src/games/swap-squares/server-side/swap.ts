import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

export function swap(G: ServerData, _ctx: Ctx, 
    {from, to} : { from: number, to: number}) : void {
    if (from !== to) {
        const tmp = G.squares[to];
        G.squares[to] = G.squares[from];
        G.squares[from] = tmp;
    }
}