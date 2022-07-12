import { Ctx } from "boardgame.io";
import { GameOptions } from "../config";
import { GameStage, ServerData } from "./server-data";

export function setOptions(G: ServerData, ctx: Ctx, options: GameOptions): void {
    if (G.stage !== GameStage.setup) {
        throw new Error("Unexpected call to startGame");
    }
    G.options = {...options};
    G.stage = GameStage.starting;
}
