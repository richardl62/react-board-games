
import { DiceScore, zeroScore, totalScore } from "./dice-score";

/** Get a score for the given dice faces.
 * In general, this will be the highest score possible,
 * but if preferSixDiceScore is true, then using all six
 * dice (even if it means a lower score) is preferred.
 * For example, with the option set
 * 1, 1, 1, 1, 2, 2 scores 500 (not 1100).
*/ 
export function getScores({faces, preferSixDiceScore, allSameScore}: {
    faces: number[], preferSixDiceScore: boolean,
    allSameScore: number,
}): 
    {
        scores: DiceScore,
        // Values (rather then indices) of unused faces 
        unusedFaces: number[]
    } 
{
    const scoreExcludingThreePairs = (() => {
        const sortedFaces = [...faces].sort();    
        const scores: DiceScore = { ...zeroScore };

        checkAllSame(sortedFaces, scores, allSameScore);
        checkAllDifferent(sortedFaces, scores);
        checkThreeOfAKind(sortedFaces, scores);
        checkAces(sortedFaces, scores);
        checkFives(sortedFaces, scores);

        return {scores, unusedFaces: sortedFaces};
    })();

    const scoreOnlyThreePairs = (() => {
        const sortedFaces = [...faces].sort();
        const scores: DiceScore = { ...zeroScore };
        checkThreePairs(sortedFaces, scores);
        return {scores, unusedFaces: sortedFaces};
    })();

    
    if(scoreOnlyThreePairs.scores.threePairs > 0) {
        if(totalScore(scoreOnlyThreePairs.scores) >=
            totalScore(scoreExcludingThreePairs.scores)) {
            return scoreOnlyThreePairs;
        }

        if(preferSixDiceScore && scoreExcludingThreePairs.unusedFaces.length > 0) {
            return scoreOnlyThreePairs;
        }
    }
    
    return scoreExcludingThreePairs;
}

function checkAllSame(sortedFaces: number[], scores: DiceScore, 
    allSameScore: number) {
    if ( sortedFaces.length === 6 &&
        sortedFaces.every(face => face === sortedFaces[0])) {
        scores.allSame += allSameScore;
        sortedFaces.splice(0);
    }
}

function checkAllDifferent(sortedFaces: number[], scores: DiceScore) {

    for(let i = 0; i < 6; ++i) {
        if (sortedFaces[i] !== i + 1) {
            return;
        }
    }

    scores.allDifferent += 1500;
    sortedFaces.splice(0);
}

function checkThreePairs(sortedFaces: number[], scores: DiceScore) {

    if(sortedFaces.length === 6 && 
        sortedFaces[0] === sortedFaces[1] &&
        sortedFaces[2] === sortedFaces[3] &&
        sortedFaces[4] === sortedFaces[5])
    {
        scores.threePairs += 500;
        sortedFaces.splice(0);
    }
}

function checkThreeOfAKind(sortedFaces: number[], scores: DiceScore) {

    const doCheck = () => {
        for (let i = 0; i < sortedFaces.length; ++i) {
            if (sortedFaces[i] === sortedFaces[i + 2]) {
                const spliced = sortedFaces.splice(i, 3);
                scores.threeOfAKind += spliced[0] === 1 ? 1000 : spliced[0] * 100;

                return true; 
            }
        }
    };

    while(doCheck());
}

function removeAllMatches(arr: number[], value: number) : number {
    let count = 0;
    const doCheck = () => {
        const index = arr.indexOf(value);
        if(index !== -1) {
            arr.splice(index, 1);
            return true;
        }
    };

    while(doCheck()) {
        ++count;
    }

    return count;
}

function checkAces(sortedFaces: number[], scores: DiceScore) {
    scores.aces += removeAllMatches(sortedFaces, 1) * 100;
}

function checkFives(sortedFaces: number[], scores: DiceScore) {
    scores.fives += removeAllMatches(sortedFaces, 5) * 50;
}



