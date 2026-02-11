export interface DiceScore {
    allSame: number;
    allDifferent: number;
    threeOfAKind: number;
    threePairs: number;
    aces: number;
    fives: number;
}

export const zeroScore: DiceScore = {
    allSame: 0, 
    allDifferent: 0,
    threeOfAKind: 0,
    threePairs: 0,
    aces: 0,
    fives: 0
};

export function totalScore(score: DiceScore): number {
    // The use of 'as' avoids lint warnings about unasafe use of any.
    return (Object.values(score) as number[]).reduce((a, b) => a + b, 0);
}
