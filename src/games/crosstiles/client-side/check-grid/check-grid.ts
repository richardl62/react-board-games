import { bonusLetters, Letter } from "../../config";
import { fixedScores, FixedScoreCategory } from "../../server-side/score-categories";
import { checkConnectivity } from "./check-connectivity";
import { getWords } from "./get-words";

export type ValidScores = { [category in FixedScoreCategory]? : number }
interface CheckGridResult {
    connectivity: ReturnType<typeof checkConnectivity>,
    validScores: ValidScores;
}

function countLetters(grid: (Letter | null)[][]) {
    return grid.flat().filter(elem => elem).length;
}

export function checkGrid(grid: (Letter | null)[][]): CheckGridResult {
    
    const connectivity = checkConnectivity(grid);

    const validScores: ValidScores = {};

    if(connectivity === "connected") {
        const words = getWords(grid);

        const singleWord = (len: number) => 
            words.length === 1 && words[0].length === len;
    
        const twoWords = (len0: number, len1: number) => 
            words.length === 2 && words[0].length === len0 && words[1].length === len1;

        if(singleWord(4)) {
            validScores.length4 = fixedScores.length4;
        }

        if(singleWord(5)) {
            validScores.length5 = fixedScores.length5;
        }

        if(singleWord(6)){
            validScores.length6 = fixedScores.length6;
        }

        if(twoWords(3,4) || twoWords(4,3)) {
            validScores.words2 = fixedScores.words2;
        }

        if(words.length > 2 && countLetters(grid) === 6) {
            validScores.words3 = fixedScores.words3;
        }
    }


    return {
        connectivity,
        validScores,
    };
}

export function nBonuses(grid: (Letter | null)[][]) : number {
    const isBonus = (letter: Letter | null) => letter && bonusLetters.includes(letter);
    return grid.flat().filter(isBonus).length;
}
