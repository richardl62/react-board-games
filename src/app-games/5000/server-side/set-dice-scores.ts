import { totalScore } from "../utils/dice-score";
import { getScores } from "../utils/get-scores";
import { scoringCategoryNames } from "../utils/scoring-category-names";
import { ServerData } from "./server-data";

/** Sets G.heldDice and G.maxDiceScore based on G.faces and G.held. */
export function setDiceScores(
    G: ServerData
)  : void {
    const {faces, held} = G;
    const heldFaces = faces.filter((_, i) => held[i]);
    const allSameScore = G.options.scoreToWin;
    const {scores: heldScores, unusedFaces: unusedHeldFaces} = 
        getScores({faces: heldFaces, preferSixDiceScore: true, allSameScore});
    const {scores: maxScore} = getScores({faces, preferSixDiceScore: false, allSameScore});
    
    G.heldDice = {
        score:totalScore(heldScores),
        categories: scoringCategoryNames(heldScores),
        numScoringFaces: heldFaces.length - unusedHeldFaces.length,
    };
    G.maxDiceScore = totalScore(maxScore);
}

