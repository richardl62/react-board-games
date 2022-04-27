import { checkGrid } from "./check-grid";
import { Letter } from "../../config";
import { ScoreCard as ScoreCardType, fixedScoreCategories } from "../../server-side/score-categories";

/** Return the subset of validScores that are not already filled on the score card. Or
 * return null, if there are no such scores.
 */
export function scoreOptions(
    scoreCard: ScoreCardType,
    grid: (Letter | null)[][]): ScoreCardType {
    const { validScores } = checkGrid(grid);
    const options: ScoreCardType = {};

    let chance = 0;
    for (const category of fixedScoreCategories) {
        const scoreOption = validScores[category];
        if (scoreOption !== undefined) {
            if (scoreCard[category] === undefined) {
                options[category] = scoreOption;
            }
            if (scoreOption > chance) {
                chance = scoreOption;
            }
        }
    }

    if (Object.keys(options).length === 0) {
        for (const category of fixedScoreCategories) {
            options[category] = 0;
        }
        if (scoreCard.chance === undefined) {
            options.chance = chance;
        }
    }

    return options;
}
