
import { DiceScore, zeroScore, totalScore } from "./dice-score";

/** Get a score for the given dice faces.
 * This will use all the dice if possible, and within that constraint
 * will give the hightest score possible.  For example
 * 1, 1, 1, 1, 2, 2 scores 500 (not 1100) but
 * 1, 1, 1, 1, 5, 5 scores 1200 (not 500).
*/ 
export function getScores(faces: number[]): 
    {
        scores: DiceScore,
        // Values (rather then indices) of unused faces 
        unusedFaces: number[]
    } 
{
    const doGetScores = (
        { includeThreePairs }: { includeThreePairs: boolean }) => {
        
        const sortedFaces = [...faces].sort();    
        const scores: DiceScore = { ...zeroScore };

        checkAllSame(sortedFaces, scores);
        checkAllDifferent(sortedFaces, scores);
        includeThreePairs && checkThreePairs(sortedFaces, scores);
        checkThreeOfAKind(sortedFaces, scores);
        checkAces(sortedFaces, scores);
        checkFives(sortedFaces, scores);

        return {scores, unusedFaces: sortedFaces};
    };

    let { scores, 
        // eslint-disable-next-line prefer-const
        unusedFaces: originalUnusedFaces, 
    } = doGetScores({ includeThreePairs: true });
    
    if ( scores.threePairs > 0) {
        // Check if a higher score is possible while still using all the faces
        const { scores: alternateScores, unusedFaces }
            = doGetScores({ includeThreePairs: false });

        if (unusedFaces.length === 0 && totalScore(alternateScores) > totalScore(scores)) {
            scores = alternateScores;
        }
    }

    return {scores, unusedFaces: originalUnusedFaces};
}


function checkAllSame(sortedFaces: number[], scores: DiceScore) {
    if ( sortedFaces.length === 6 &&
        sortedFaces.every(face => face === sortedFaces[0])) {
        scores.allSame += 5000;
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



