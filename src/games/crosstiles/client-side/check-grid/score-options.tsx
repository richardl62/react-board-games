import { Letter } from "../../config";
import { ScoreCard  } from "../../server-side/score-card";
import { fixedScoreCategories, FixedScoreCategory, fixedScores } from "../../server-side/score-categories";
import { checkConnectivity } from "./check-connectivity";
import { getWords } from "./get-words";

export type FixedScoreOptions = { [category in FixedScoreCategory]? : number }

function countLetters(grid: (Letter | null)[][]) {
    return grid.flat().filter(elem => elem).length;
}

/** Get the valid fixed score options for the grid.
 * 'Fixed score' means scores other than bonus and chance.
 */
function fixedScoreOptions(grid: (Letter | null)[][]): FixedScoreOptions {

    if(checkConnectivity(grid) !== "connected") {
        return {};
    }

    const words = getWords(grid);

    const validScores: FixedScoreOptions = {};

    const singleWord = (len: number) =>
        words.length === 1 && words[0].length === len;

    const twoWords = (len0: number, len1: number) =>
        words.length === 2 && words[0].length === len0 && words[1].length === len1;

    if (singleWord(4)) {
        validScores.length4 = fixedScores.length4;
    }

    if (singleWord(5)) {
        validScores.length5 = fixedScores.length5;
    }

    if (singleWord(6)) {
        validScores.length6 = fixedScores.length6;
    }

    if (twoWords(3, 4) || twoWords(4, 3)) {
        validScores.words2 = fixedScores.words2;
    }

    if (words.length > 2 && countLetters(grid) === 6) {
        validScores.words3 = fixedScores.words3;
    }

    return validScores;
}

/** Return the subset of validScores that are not already filled on the score card. Or
 * return null, if there are no such scores.
 */
export function scoreOptions(
    scoreCard: ScoreCard,
    grid: (Letter | null)[][]): ScoreCard | null
{
    const fixedScores = fixedScoreOptions(grid);
    const options: ScoreCard = {};

    let chanceScore = null;
    for (const category of fixedScoreCategories) {
        const scoreOption = fixedScores[category];
        if (scoreOption !== undefined) {
            if (scoreCard[category] === undefined) {
                options[category] = scoreOption;
            }
            if (!chanceScore || scoreOption > chanceScore) {
                chanceScore = scoreOption;
            }
        }
    }

    if (Object.keys(options).length === 0) {
        if (scoreCard.chance === undefined && chanceScore !== null) {
            options.chance = chanceScore;
        }
    }

    return Object.keys(options).length === 0 ? null : options;
}