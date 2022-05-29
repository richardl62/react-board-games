import { bonusLetters, Letter } from "../../config";
import { ScoreCard } from "../../server-side/score-card";
import { checkConnectivity } from "./check-connectivity";
import { getWords } from "./get-words";
import { scoreOptions as getScoreOptions } from "./score-options";

interface CheckGridResult {
    connectivity: ReturnType<typeof checkConnectivity>,
    illegalWords: string[] | null;
    scoreOptions: ScoreCard | null;
    nBonuses: number;
}

export function checkGrid(
    scoreCard: ScoreCard, 
    grid: (Letter | null)[][],
    isLegalWord: (word: string) => boolean,
): CheckGridResult {
    
    const connectivity = checkConnectivity(grid);

    const words = getWords(grid);
    let illegalWords : string[] | null = words.filter(word => !isLegalWord(word));
    if(illegalWords.length === 0) {
        illegalWords = null;
    }

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
