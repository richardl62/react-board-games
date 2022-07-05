import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { ScoreCategory } from "../score-categories";
import { ServerData, GameStage } from "./server-data";

export interface ScoreWithCategory {
    category: ScoreCategory;
    score: number;
    bonus: number;
}

export function doSetScore(G: ServerData, playerID: string, arg: ScoreWithCategory): void {
    const { category, score, bonus } = arg;
    const { scoreCard } =  G.playerData[playerID];
    scoreCard[category] = score;
    if(bonus) {
        if(scoreCard.bonus) {
            scoreCard.bonus += bonus;
        } else {
            scoreCard.bonus = bonus;
        }
    }
    G.playerData[playerID].chosenCategory = category;
}

export function setScore(G: ServerData, ctx: Ctx, arg: ScoreWithCategory): void {
    if (G.stage !== GameStage.scoring) {
        throw new Error("Unexpected call to recordGrid");
    }
    const { playerID } = ctx;
    sAssert(playerID);

    doSetScore(G, playerID, arg);
}