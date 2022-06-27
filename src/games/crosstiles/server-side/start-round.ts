import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { scoreCardFull } from "./score-card";
import { selectLetters } from "./select-letters";
import { GameStage, ServerData } from "./server-data";

export function startRound(G: ServerData, ctx: Ctx): void {
    const { stage, playerData } = G;

    sAssert(stage === GameStage.makingGrids);

    let gameOver = true;
    for(const pid in playerData) {
        if(!scoreCardFull(playerData[pid].scoreCard)) {
            gameOver = false;
        }
    } 

    if(gameOver) {
        G.stage = GameStage.over;
    } else {
        G.round = G.round + 1;
        const sharedLetters = selectLetters(ctx);

        for (const pid in G.playerData) {
            G.playerData[pid].selectedLetters = G.options.playersGetSameLetters ?
                sharedLetters : selectLetters(ctx),
            G.playerData[pid].readyForNextRound = false;
            G.playerData[pid].grid = null;
            G.playerData[pid].makeGridStartTime = null;
            G.playerData[pid].doneRecordingGrid = false;
            G.playerData[pid].chosenCategory = null;
        }
    }

}
