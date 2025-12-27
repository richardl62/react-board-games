import { recordEmptyGrid } from "./record-grid.js";
import { ServerData, GameStage } from "../server-data.js";
import { doSetScore } from "./set-score.js";
import { MoveArg0 } from "../../../move-fn.js";

export function doneRecordingGrid(
    {G, playerID} : MoveArg0<ServerData>,
    _arg: void
): void {
    // This function is called during the scoring stage occur if no grid has been recorded.
    // I'm not sure if this is desirable, but it seems to work.
    if (G.stage !== GameStage.makingGrids && G.stage !== GameStage.scoring) {
        throw new Error(`doneRecordingGrid during ${G.stage} stage`);
    }
    
    if(!G.playerData[playerID].gridRackAndScore) {
        recordEmptyGrid(G, playerID);
    }
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

