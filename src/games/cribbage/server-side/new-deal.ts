import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";
import { newDealData } from "./starting-server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function newDeal(G: ServerData, ctx: Ctx, arg: void): ServerData {
    return {
        ...G,
        ...newDealData(G),
    };
}
