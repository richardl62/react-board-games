import { Letter } from "../config";
import { ScoreCategory } from "../server-side/score-categories";

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
            length3: false,
            length4: false,
            length5: 50,
        },
    };
}
