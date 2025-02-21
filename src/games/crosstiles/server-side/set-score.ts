import { ScoreCategory } from "../score-categories";
import { ServerData, GameStage } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

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

export function setScore(
    { G, playerID } : MoveArg0<ServerData>,
    arg: ScoreWithCategory
): void {
    if (G.stage !== GameStage.scoring) {
        throw new Error("Unexpected call to recordGrid");
    }

    doSetScore(G, playerID, arg);
}
