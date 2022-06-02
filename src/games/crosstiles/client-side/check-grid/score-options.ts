import { Letter } from "../../config";
import { FixedScoreCategory } from "../../score-categories";
import { ScoreCard } from "../../server-side/score-card";
import { checkConnectivity } from "./check-connectivity";
import { getWords } from "./get-words";

export type FixedScoreOptions = { [category in FixedScoreCategory]? : number }

function countLetters(grid: (Letter | null)[][]) {
    return grid.flat().filter(elem => elem).length;
}

/** Find the fixed score category for the grid, or return null if there is none.
 * 'Fixed score' means scores other than bonus and chance.
 */
function findFixedScoreCategory(grid: (Letter | null)[][]): FixedScoreCategory | null {

    if(checkConnectivity(grid) !== "connected") {
        return null;
    }

    const words = getWords(grid);

    const singleWord = (len: number) =>
        words.length === 1 && words[0].length === len;

    const twoWords = (len0: number, len1: number) =>
        words.length === 2 && words[0].length === len0 && words[1].length === len1;

    if (singleWord(4)) {
        return "length4";
    }

    if (singleWord(5)) {
        return "length5";
    }

    if (singleWord(6)) {
        return "length6";
    }

    if (twoWords(3, 4) || twoWords(4, 3)) {
        return "words2";
    }

    if (words.length > 2 && countLetters(grid) === 6) {
        return "words3";
    }

    return null;
}

interface ScoreOption {
    // The categery found just from the grid.
    gridCategory: FixedScoreCategory | null;

    // The scoring category taking account of previous scores
    // (but no spelling check).
    scoringCategory: FixedScoreCategory | "chance" | null;
}

export function findScoreOption(
    grid: (Letter | null)[][],
    scoreCard: ScoreCard,
): ScoreOption
{
    const gridCategory = findFixedScoreCategory(grid);

    let scoringCategory:FixedScoreCategory | "chance" | null = null;
    
    if (gridCategory) {
        const currentScore = scoreCard[gridCategory];

        if (currentScore === undefined) {
            scoringCategory = gridCategory;
        } else if (currentScore > 0 && scoreCard[gridCategory] === undefined) {
            scoringCategory = "chance";
        } 
    }
    return {gridCategory, scoringCategory};
}
