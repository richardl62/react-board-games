import { Ctx } from "boardgame.io";
import { GameStage, ServerData } from "./server-data";
import { startNextStage } from "./start-next-stage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setOptions(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.settingOptions) {
        throw new Error("Unexpected call to startGame");
    }

    startNextStage(G, ctx);
}
