import { DiceScore, zeroScore } from "./dice-score";
import { getScores } from "./get-scores";

const allSameScore = 5555;

const testData: [number[], "prefer6" | "", Partial<DiceScore>][] = [
    [[1, 1, 1, 1, 1, 1], "prefer6",  { allSame: allSameScore }],
    [[1, 2, 3, 4, 5, 6], "prefer6",  { allDifferent: 1500 }],
        
    [[1, 1, 1, 1, 2, 5], "prefer6",  { threeOfAKind: 1000, aces: 100, fives: 50 }],
    [[1, 1, 1, 2, 2, 2], "prefer6",  { threeOfAKind: 1200 }],
    [[1, 1, 2, 2, 2, 3], "prefer6",  { threeOfAKind: 200, aces: 200 }],

    [[1, 1, 1, 1, 5, 5], "prefer6",  { threeOfAKind: 1000, aces: 100, fives: 100 }],
    [[1, 1, 5, 5, 5, 5], "prefer6",  { threeOfAKind: 500, aces: 200, fives: 50 }],

    [[1, 1, 1, 1, 3, 3], "prefer6",  { threePairs: 500 }], // Three pairs to use up all dice.
    [[1, 1, 1, 1, 3, 3], "",         { threeOfAKind: 1000, aces: 100, }],
    [[1, 1, 2, 2, 3, 3], "",         { threePairs: 500 }],

    [[1, 1, 1, 2, 2, 2], "prefer6",  { threeOfAKind: 1200 }],
    [[1, 1, 1, 5, 5, 5], "prefer6",  { threeOfAKind: 1500 }],

    [[1, 2, 3, 5, 5, 5], "prefer6",  { threeOfAKind: 500, aces: 100 }],

    [[1, 1, 5, 5, 2, 3], "prefer6",  { aces: 200, fives: 100 }],
    [[2, 3, 4, 4, 6, 6], "prefer6",  {}],
];

test.each(testData)("%j %j score %j", (faces, prefer6, expected) => {
    const actualScore: DiceScore = getScores({faces,
        preferSixDiceScore: prefer6 === "prefer6",
        allSameScore,
    }).scores;
    const expectedScore: DiceScore = {...zeroScore, ...expected};
    
    expect(actualScore).toEqual(expectedScore);
});



