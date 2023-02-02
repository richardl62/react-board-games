import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";


export function showCutCard(G: ServerData, _ctx: Ctx, _arg: void): void {
    G.cutCard.visible = true;
}
