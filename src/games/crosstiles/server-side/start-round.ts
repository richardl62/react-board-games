import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { scoreCardFull } from "./score-card";
import { selectLetters } from "./select-letters";
import { GameStage, ServerData, startingPlayerData } from "./server-data";

export function startRound(G: ServerData, ctx: Ctx): void {
    const { stage, playerData, options } = G;

    sAssert(stage === GameStage.makingGrids);

    for (const pid in G.playerData) {
        const scoreCard = G.playerData[pid].scoreCard;
        G.playerData[pid] = startingPlayerData();
        G.playerData[pid].scoreCard = scoreCard;
    }

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

        if(G.options.playersGetSameLetters) {
            const sharedLetters = selectLetters(ctx, options);
            for (const pid in G.playerData) {
                G.playerData[pid].selectedLetters = sharedLetters;
            }
        } else {
            for (const pid in G.playerData) {
                G.playerData[pid].selectedLetters = selectLetters(ctx, options);
            }
        }
    }

}
