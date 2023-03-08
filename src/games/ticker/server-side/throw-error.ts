import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";

export function throwError(_G: ServerData, _ctx: Ctx, message: string): void {
    throw new Error(message);
}
