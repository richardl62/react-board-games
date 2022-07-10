import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { ServerData, GameStage } from "./server-data";
import { doSetScore } from "./set-score";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function doneRecordingGrid(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to doneRecordingGrid - " + G.stage);
    }
    
    const { playerID } = ctx;
    sAssert(playerID);

    // Client code must ensure a grid has been recorded before calling this function
    // (e.g. by recording dummy grid if one has not been explicitly recorded).
    sAssert(G.playerData[playerID].gridRackAndScore,
        "Grid, rack and score not recorded"); 

    G.playerData[playerID].doneRecordingGrid = true;

    let allPlayersDoneRecordingGrids = true;
    for (const pid in G.playerData) {
        if (!G.playerData[pid].doneRecordingGrid) {
            allPlayersDoneRecordingGrids = false;
        }
    }

    if (allPlayersDoneRecordingGrids) {
        G.stage = GameStage.scoring;
        applyRecordedScores(G);
    }
}
function applyRecordedScores(G: ServerData) {
    for (const pid in G.playerData) {
        const score = G.playerData[pid].gridRackAndScore?.score;
        if(score) {
            doSetScore(G, pid, score);
        }
    }
}

