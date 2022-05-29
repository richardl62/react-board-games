import { bonusLetters, Letter } from "../../config";
import { ScoreCard } from "../../server-side/score-card";
import { checkConnectivity } from "./check-connectivity";
import { scoreOptions as getScoreOptions } from "./score-options";

interface CheckGridResult {
    connectivity: ReturnType<typeof checkConnectivity>,
    illegalWords: string[] | null;
    scoreOptions: ScoreCard | null;
    nBonuses: number;
}

/** Dummy implementation */
export function getIllegalWords(grid: (Letter | null)[][]) : string[] | null {
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
