import { sAssert } from "../../../../utils/assert";
import { ScoreCard, ScoreCategory } from "../../server-side/score-categories";


export function totalScore(scoreCard: ScoreCard) : number {
    let total = 0;

    for(const category in scoreCard) {
        const score = scoreCard[category as ScoreCategory];
        sAssert(score !== undefined);
        total += score;
    }

    return total;
}