import { Ctx } from "boardgame.io";
import { ServerData, initialSquares } from "./server-data";

export function reset(G: ServerData, _ctx: Ctx, _arg: void) : void {
    G.squares = [...initialSquares];
}