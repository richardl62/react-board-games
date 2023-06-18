import { totalScore } from "../utils/dice-score";
import { getScores } from "../utils/get-scores";
import { scoringCategoryNames } from "../utils/scoring-category-names";
import { ServerData } from "./server-data";

export function setDiceScores(
    faces: number[],
    held: boolean[],
    G: Pick<ServerData, "heldDice" | "maxDiceScore">
)  : void {
    const heldFaces = faces.filter((_, i) => held[i]);

    const {scores: heldScores, unusedFaces: unusedHeldFaces} = 
        getScores({faces: heldFaces, preferSixDiceScore: true});
    const {scores: maxScore} = getScores({faces, preferSixDiceScore: false});
    
    G.heldDice = {
        score:totalScore(heldScores),
        categories: scoringCategoryNames(heldScores),
        numScoringFaces: heldFaces.length - unusedHeldFaces.length,
    };
    G.maxDiceScore = totalScore(maxScore);
}

