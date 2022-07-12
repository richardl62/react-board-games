import { sAssert } from "../../../utils/assert";
import { scoreCategories, ScoreCategory } from "../score-categories";

export type ScoreCard = {[category in ScoreCategory]? : number};

export function startingScoreCard(): ScoreCard {
    return {
        bonus: 0,
    };
}

export function scoreCardFull(scoreCard: ScoreCard) : boolean {
    for(const category of scoreCategories) {
        if(scoreCard[category] === undefined) {
            return false;
        }
    }
    return true;
}

export function totalScore(scoreCard: ScoreCard) : number {
    let total = 0;

    for(const category in scoreCard) {
        const score = scoreCard[category as ScoreCategory];
        sAssert(score !== undefined);
        total += score;
    }

    return total;
}