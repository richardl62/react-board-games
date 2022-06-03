import { Letter } from "../../config";
import { FixedScoreCategory } from "../../score-categories";
import { ScoreCard } from "../../server-side/score-card";
import { checkConnectivity } from "./check-connectivity";
import { countBonusLetters } from "./count-bonus-letters";
import { findIllegalWords } from "./find-illegal-words";
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

    // Checked only for grids that would otherwise score.
    // Null if not checked or if all words are legal.
    illegalWords: string[] | null;

    // Scoring options depending on score card and spelling
    // checks
    scoreAs: "self" | "chance" | false;

    // 0 for grids that do not score.
    nBonuses: number;
}

export function findGridCategory(
    grid: (Letter | null)[][],
    scoreCard: ScoreCard,
    isLegalWord: ((word: string) => boolean) | null,
): ScoreOption
{
    const gridCategory = findFixedScoreCategory(grid);
    
    let scoreAs : ScoreOption["scoreAs"];
    if (!gridCategory) {
        scoreAs = false;
    } else if (scoreCard[gridCategory] === undefined) {
        scoreAs = "self";
    } else if(scoreCard["chance"] === undefined ) {
        scoreAs = "chance";
    } else {
        scoreAs = false;
    }

    let illegalWords : string[] | null = null;

    if(scoreAs && isLegalWord) {
        illegalWords = findIllegalWords(grid, isLegalWord);
        if(illegalWords) {
            scoreAs = false;
        }
    }

    const nBonuses = scoreAs ? countBonusLetters(grid) : 0;

    return {gridCategory, scoreAs, illegalWords, nBonuses};
}
