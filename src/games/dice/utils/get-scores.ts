import { DiceScore } from "./dice-score";

// Get the highest score available from the dice
export function getScores(faces: number[]): DiceScore {

    const scores : DiceScore ={
        allSame: 0,
        allDifferent: 0,
        threeOfAKind: 0,
        threePairs: 0,
        aces: 0,
        fives: 0
    };

    const sortedFaces = [...faces].sort();

    checkAllSame(sortedFaces, scores);
    checkAllDifferent(sortedFaces, scores);
    checkThreeOfAKind(sortedFaces, scores);
    checkThreePairs(sortedFaces, scores);
    checkAces(sortedFaces, scores);
    checkFives(sortedFaces, scores);

    return scores;
}


function checkAllSame(sortedFaces: number[], scores: DiceScore) {
    if ( sortedFaces.length === 6 &&
        sortedFaces.every(face => face === sortedFaces[0])) {
        scores.allSame += 5000;
        sortedFaces.splice(0, sortedFaces.length);
    }
}

function checkAllDifferent(sortedFaces: number[], scores: DiceScore) {

    for(let i = 0; i < 6; ++i) {
        if (sortedFaces[i] !== i + 1) {
            return;
        }
    }

    scores.allDifferent += 1500;
    sortedFaces.splice(0, sortedFaces.length);
}

function checkThreeOfAKind(sortedFaces: number[], scores: DiceScore) {

    const doCheck = () => {
        for (let i = 0; i < sortedFaces.length; ++i) {
            if (sortedFaces[i] === sortedFaces[i + 2]) {
                scores.threeOfAKind += sortedFaces[0] === 1 ? 1000 : sortedFaces[0] * 100;
                sortedFaces.splice(i, 3);
                return true;
            }
        }
    };

    while(doCheck());
}

function checkThreePairs(sortedFaces: number[], scores: DiceScore) {

    if(sortedFaces.length === 6 && 
        sortedFaces[0] === sortedFaces[1] &&
        sortedFaces[2] === sortedFaces[3] &&
        sortedFaces[4] === sortedFaces[5])
    {
        scores.threePairs += 500;
        sortedFaces.splice(0, sortedFaces.length);
    }
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



