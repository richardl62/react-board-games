import { Ctx } from "boardgame.io";
import { GameOptions, GameStage, ServerData } from "./server-data";
import { startNextStage } from "./start-next-stage";

export function setOptions(G: ServerData, ctx: Ctx, options: GameOptions): void {
    if (G.stage !== GameStage.settingOptions) {
        throw new Error("Unexpected call to startGame");
    }
    G.options = {...options};
    startNextStage(G, ctx);
}
