import { Ctx } from "boardgame.io";
import { selectTiles } from "./select-tiles";
import { GameStage, ServerData } from "./server-data";

function nextStage(stage: GameStage) {
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
    G.stage = nextStage(G.stage);

    if(G.stage === GameStage.pollingForReady) {
        G.round = G.round + 1;
        G.selectedLetters = null;

        for (const pid in G.playerData) {
            G.playerData[pid].ready = false;
        }
    } 
    
    if(G.stage === GameStage.makingGrids) {
        G.selectedLetters = selectTiles();
    }
    
    if(G.stage === GameStage.scoring) {
        G.playerToScore = ctx.playOrder[0];
    } 
}