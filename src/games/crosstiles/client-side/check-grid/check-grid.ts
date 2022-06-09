import { sAssert } from "../../../../utils/assert";
import { Letter } from "../../config";
import { FixedScoreCategory, fixedScores, ScoreCategory } from "../../score-categories";
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

interface CheckGridResult {
    /** The categery found just from the grid. */
    gridCategory: FixedScoreCategory | null;

    /** The category to be entered on the score card. 
    Differs from gridCategory if there is a spelling error (in which case it
    will be null) or the gridCategory is already filled in on the score card 
    (in which case it will be "chance" or null); */ 
    scoreCategory: ScoreCategory | null;


    /** Checked only when the gridCategory is non-null */
    illegalWords: string[] | null;

    /** The score ignoring bonuses */ 
    score: number;

    // 0 for grids that do not score.
    nBonuses: number;
}

export function checkGrid(
    grid: (Letter | null)[][],
    scoreCard: ScoreCard,
    isLegalWord: ((word: string) => boolean),
): CheckGridResult
{
    const gridCategory = findFixedScoreCategory(grid);
    
    let scoreCategory: ScoreCategory | null = null;
    let illegalWords = null;
    let score = 0;
    let nBonuses = 0;

    if (gridCategory) {
        if(scoreCard[gridCategory] === undefined) {
            scoreCategory = gridCategory;
        } else if(scoreCard[gridCategory] !== 0 && scoreCard["chance"] === undefined ) {
            scoreCategory = "chance";
        }
    } 

    if( scoreCategory) {
        illegalWords = findIllegalWords(grid, isLegalWord);
        if(illegalWords) {
            scoreCategory = null;
        }
    }

    if( scoreCategory ) {
        sAssert(gridCategory);
        score = fixedScores[gridCategory];
        nBonuses = countBonusLetters(grid);
    }

    return {gridCategory, scoreCategory, illegalWords, score, nBonuses};
}
