import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { makeEmptyGrid } from "./make-empty-grid";
import { ServerData, GameStage } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function doneRecordingGrid(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to doneRecordingGrid - " + G.stage);
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].doneRecordingGrid = true;
    if(!G.playerData[playerID].grid) {
        G.playerData[playerID].grid = makeEmptyGrid();
    }

    let allPlayersDoneRecordingGrids = true;
    for (const pid in G.playerData) {
        if (!G.playerData[pid].doneRecordingGrid) {
            allPlayersDoneRecordingGrids = false;
        }
    }

    if (allPlayersDoneRecordingGrids) {
        G.stage = GameStage.scoring;
    }
}
