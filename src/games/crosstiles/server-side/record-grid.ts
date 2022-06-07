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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function doneRecordingGrid(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to recordGrid");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].doneRecordingGrid = true;

    let allPlayersDoneRecordingGrids = true;
    for (const pid in G.playerData) {
        if(!G.playerData[pid].doneRecordingGrid) {
            allPlayersDoneRecordingGrids = false;
        }
    }

    if (allPlayersDoneRecordingGrids) {
        startNextStage(G, ctx);
    }
}