import { Ctx } from "boardgame.io";
import { scoreCardFull } from "./score-card";
import { selectLetters } from "./select-letters";
import { GameStage, ServerData } from "./server-data";

function nextStage(G: ServerData) {
    const { stage, playerData } = G;
    let gameOver = true;
    for(const pid in playerData) {
        if(!scoreCardFull(playerData[pid].scoreCard)) {
            gameOver = false;
        }
    } 
    
    if(gameOver) {
        return GameStage.gameOver;
    }

    if(stage === GameStage.pollingForReady) {
        return GameStage.makingGrids;

    } 
    
    if(stage === GameStage.makingGrids) {
        return GameStage.scoring;
    } 
    
    if(stage === GameStage.scoring) {
        return GameStage.pollingForReady;
    } 

    throw new Error("Problem stating next stage");
}

export function startNextStage(G: ServerData, ctx: Ctx) : void {
    G.stage = nextStage(G);

    if(G.stage === GameStage.pollingForReady) {
        G.round = G.round + 1;
        G.selectedLetters = selectLetters();

        for (const pid in G.playerData) {
            G.playerData[pid].ready = false;
        }
    } 
    
    if(G.stage === GameStage.scoring) {
        G.playerToScore = ctx.playOrder[0];
    } 
}