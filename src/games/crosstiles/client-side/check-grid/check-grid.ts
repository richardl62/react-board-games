import { Letter } from "../../config";
import { ScoreCategory } from "../../server-side/score-categories";

interface CheckGridResult {
    illegalWords: string[] | null;
    validScores: { [category in ScoreCategory] : number | false };
}

export function checkGrid(grid: (Letter | null)[][]): CheckGridResult {
    let illegalWords = null;
    if (grid[0][0]) {
        illegalWords = ["just", "testing"]; //KLUDGE for testing
    }

    return {
        illegalWords,
        validScores: {
            length4: false,
            length5: 40,
            length6: 50,
            words2: false,
            words3: false,
            kind6: false,
            chance: false,
            bonus: false,
        },
    };
}
