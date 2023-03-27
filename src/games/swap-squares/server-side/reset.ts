import { Ctx } from "boardgame.io";
import { ServerData, setSquares } from "./server-data";

export function reset(G: ServerData, _ctx: Ctx, _arg: void) : void {
    setSquares(G);
}