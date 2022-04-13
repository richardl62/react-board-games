import { Ctx } from "boardgame.io";
import { selectTiles } from "./select-tiles";
import { GameStage, ServerData } from "./server-data";


export function startNextStage(G: ServerData, ctx: Ctx) : void {

    if(G.stage === GameStage.pollingForReady) {
        G.stage = GameStage.makingGrids;
        G.selectedLetters = selectTiles();
    } else if(G.stage === GameStage.makingGrids) {
        G.stage = GameStage.scoring;
        G.playerToScore = ctx.playOrder[0];
    } else if(G.stage === GameStage.scoring) {
        G.stage = GameStage.pollingForReady;

        for (const pid in G.playerData) {
            G.playerData[pid].ready = false;
        }
    } else {
        throw new Error("Problem stating next stage");
    }
}