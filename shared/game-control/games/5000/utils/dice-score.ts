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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Object.values(score).reduce((a, b) => a + b);
}
