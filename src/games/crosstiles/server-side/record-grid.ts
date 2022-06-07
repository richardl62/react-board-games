import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { Letter } from "../config";
import { ServerData, GameStage } from "./server-data";

export function recordGrid(G: ServerData, ctx: Ctx, grid: (Letter | null)[][]): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to recordGrid - " + G.stage);
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].grid = grid.map(row => [...row]);
}