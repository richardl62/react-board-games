interface DiceScore {
    allSame: number;
    allDifferent: number;
    threeOfAKind: number;
    threePairs: number;
    aces: number;
    fives: number;
}

// Get the highest score available from the dice
export function getScore(faces: number[]): DiceScore {

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

function nonZeroValues(scores: Partial<DiceScore>) : string {
    let string = "";
    for(const key in scores) {
        const score = scores[key as keyof DiceScore];
        if(score !== 0) {
            string += ` ${key}: ${score}`;
        }
    }
    return string;
}

function doOneTest(
    faces: number[],
    expectedScores: Partial<DiceScore>)
{
    const scores = getScore(faces);
    let message = `${JSON.stringify(faces)} ${nonZeroValues(scores)}`;
    
    let pass = true;
    for(const key in scores) {
        const score = scores[key as keyof DiceScore];
        
        const es = expectedScores[key as keyof DiceScore];
        const expectedScore = es === undefined ? 0 : es;
        
        if(score !== expectedScore) {
            pass = false;
        }
    }

    if(!pass) {
        message += ` - ERROR expected ${nonZeroValues(expectedScores)}`;
    }
    console.log(message);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doTests() {
    doOneTest([1, 1, 1, 1, 1, 1], { allSame: 5000 });
    doOneTest([1, 2, 3, 4, 5, 6], { allDifferent: 1500 });
    
    doOneTest([1, 1, 1, 1, 2, 5], { threeOfAKind: 1000, aces: 100, fives: 50 });
    doOneTest([1, 1, 1, 2, 2, 2], { threeOfAKind: 1200 });
    doOneTest([1, 1, 2, 2, 2, 3], { threeOfAKind: 200 });
    doOneTest([1, 1, 2, 2, 3, 3], { threePairs: 500 });

    doOneTest([1, 1, 1, 2, 2, 2], { threeOfAKind: 1200 });
    doOneTest([1, 1, 1, 5, 5, 5], { threeOfAKind: 1500 });

    doOneTest([1, 1, 5, 5, 2, 3], { aces: 200, fives: 100 });
    doOneTest([2, 3, 4, 4, 6, 6], {});
    doOneTest([], {});
}

//doTests();



