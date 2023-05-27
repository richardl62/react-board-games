import { DiceScore, zeroScore } from "./dice-score";
import { getScores } from "./get-scores";

const testData: [number[], Partial<DiceScore>][] = [
    [[1, 1, 1, 1, 1, 1], { allSame: 5000 }],
    [[1, 2, 3, 4, 5, 6], { allDifferent: 1500 }],
        
    [[1, 1, 1, 1, 2, 5], { threeOfAKind: 1000, aces: 100, fives: 50 }],
    [[1, 1, 1, 2, 2, 2], { threeOfAKind: 1200 }],
    [[1, 1, 2, 2, 2, 3], { threeOfAKind: 200, aces: 200 }],

    [[1, 1, 1, 1, 5, 5], { threeOfAKind: 1000, aces: 100, fives: 100 }],
    [[1, 1, 5, 5, 5, 5], { threeOfAKind: 500, aces: 200, fives: 50 }],

    [[1, 1, 1, 1, 3, 3], { threePairs: 500 }], // Three pairs to use up all dice.
    [[1, 1, 2, 2, 3, 3], { threePairs: 500 }],

    [[1, 1, 1, 2, 2, 2], { threeOfAKind: 1200 }],
    [[1, 1, 1, 5, 5, 5], { threeOfAKind: 1500 }],

    [[1, 2, 3, 5, 5, 5], { threeOfAKind: 500, aces: 100 }],

    [[1, 1, 5, 5, 2, 3], { aces: 200, fives: 100 }],
    [[2, 3, 4, 4, 6, 6], {}],
];

test.each(testData)("%j score %j", (dice, expected) => {
    const fullScore = {... zeroScore, ...expected};
    expect(getScores(dice)).toEqual(fullScore);
});



