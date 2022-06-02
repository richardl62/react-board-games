import { bonusLetters, Letter } from "../../config";

export function countBonusLetters(    
    grid: (Letter | null)[][]
) : number {
    let count = 0;
    for(const row of grid) {
        for(const letter of row) {
            if(letter && bonusLetters.includes(letter)) {
                ++count;
            }
        }
    }

    return count;
}