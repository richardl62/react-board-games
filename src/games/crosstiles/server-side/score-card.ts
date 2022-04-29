import { ScoreCategory } from "./score-categories";

export type ScoreCard = {[category in ScoreCategory]? : number};

export function startingScoreCard(): ScoreCard {
    return {
        /* start of  temporary code */
        length4: 11,
        length5: 11,
        length6: 11,
        words2: 11,
        words3: 11,
        /* start of  temporary code */


        bonus: 0
    };
}