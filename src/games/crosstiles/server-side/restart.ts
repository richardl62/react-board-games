import { Ctx } from "boardgame.io";
import { GameStage, ServerData, startingServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function restart(G: ServerData, ctx: Ctx, option: void): void {
    const newG = startingServerData(ctx);
    newG.options = G.options;
    newG.stage = GameStage.starting;

    Object.assign(G, newG);
}
