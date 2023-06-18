import { totalScore } from "../utils/dice-score";
import { getScores } from "../utils/get-scores";
import { scoringCategoryNames } from "../utils/scoring-category-names";
import { ServerData } from "./server-data";

export function getDiceScores(
    faces: number[],
    held: boolean[],
)  : Omit<ServerData["diceScores"],"prevRollHeld"> {
    const heldFaces = faces.filter((_, i) => held[i]);
    const unheldFaces = faces.filter((_, i) => !held[i]);

    const {scores: heldScores, unusedFaces: unusedHeldFaces} = 
        getScores({faces: heldFaces, preferSixDiceScore: true});
    const {scores: maxScore} = getScores({faces, preferSixDiceScore: false});
    return {
        held: totalScore(heldScores),
        heldCategories: scoringCategoryNames(heldScores),
        nonScoringFaces: [...unheldFaces, ...unusedHeldFaces,],
        max: totalScore(maxScore),
    };
}

