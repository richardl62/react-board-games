import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { Letter } from "../config";
import { ServerData, GameStage } from "./server-data";
import { startNextStage } from "./start-next-stage";

export function recordGrid(G: ServerData, ctx: Ctx, grid: (Letter | null)[][]): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to recordGrid");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].grid = grid.map(row => [...row]);

    let allGridsRecorded = true;
    for (const pid in G.playerData) {
        allGridsRecorded = allGridsRecorded && G.playerData[pid].grid !== null;
    }

    if (allGridsRecorded) {
        startNextStage(G, ctx);
    }
}