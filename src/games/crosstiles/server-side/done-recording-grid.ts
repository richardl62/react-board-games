import { recordEmptyGrid } from "./record-grid";
import { ServerData, GameStage } from "./server-data";
import { doSetScore } from "./set-score";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function doneRecordingGrid(
    {G, playerID} : MoveArg0<ServerData>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _arg: void
): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to doneRecordingGrid - " + G.stage);
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

