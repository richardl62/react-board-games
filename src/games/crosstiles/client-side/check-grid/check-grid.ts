import { bonusLetters, Letter } from "../../config";
import { FixedScoreCategory, ScoreCard } from "../../server-side/score-categories";
import { checkConnectivity } from "./check-connectivity";
import { scoreOptions as getScoreOptions } from "./score-options";

export type ValidScores = { [category in FixedScoreCategory]? : number }
interface CheckGridResult {
    connectivity: ReturnType<typeof checkConnectivity>,
    illegalWords: string[] | null;
    scoreOptions: ValidScores | null;
    nBonuses: number;
}

/** Dummy implementation */
function getIllegalWords(grid: (Letter | null)[][]) {
    if(grid[0][0]) {
        return ["just", "testing"];
    }

    return null;
}

export function checkGrid(scoreCard: ScoreCard, grid: (Letter | null)[][]): CheckGridResult {
    
    const connectivity = checkConnectivity(grid);

    const illegalWords = getIllegalWords(grid);

    let scoreOptions = null;
    let nBonuses = 0;

    if(connectivity === "connected" && !illegalWords) {
        scoreOptions = getScoreOptions(scoreCard, grid);

        const isBonus = (letter: Letter | null) => letter && bonusLetters.includes(letter);
        nBonuses = grid.flat().filter(isBonus).length;
    }

    return {
        connectivity,
        illegalWords,
        scoreOptions,
        nBonuses,
    };
}
