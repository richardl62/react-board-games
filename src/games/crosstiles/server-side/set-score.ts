import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { ScoreCategory } from "./score-categories";
import { ServerData, GameStage } from "./server-data";
import { startNextStage } from "./start-next-stage";

interface setScoreArg {
    category: ScoreCategory;
    score: number;
    bonus: number;
}

export function setScore(G: ServerData, ctx: Ctx, arg: setScoreArg): void {
    if (G.stage !== GameStage.scoring) {
        throw new Error("Unexpected call to recordGrid");
    }
    const { playerID } = ctx;
    sAssert(playerID);

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
    G.playerData[playerID].scoreChoosen = category;

    let scoreChoosenByAll = true;
    for(const pid in G.playerData) {
        if(!G.playerData[pid].scoreChoosen) {
            scoreChoosenByAll = false; 
        }
    }

    if(scoreChoosenByAll) {
        startNextStage(G, ctx);
    }
}