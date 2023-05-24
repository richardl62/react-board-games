export interface DiceScore {
    allSame: number;
    allDifferent: number;
    threeOfAKind: number;
    threePairs: number;
    aces: number;
    fives: number;
}

function categoryName(category: keyof DiceScore): string {
    switch (category) {
    case "allSame": return "all the same";
    case "allDifferent": return "all different";
    case "threeOfAKind": return "three of a kind";
    case "threePairs": return "three pairs";
    case "aces": return "aces";
    case "fives": return "fives";
    }
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
    return Object.values(score).reduce((a, b) => a + b);
}

export function scoringCategoryNames(score: DiceScore): string[] {
    const names : string[] = [];
    for(const k in score) {
        const key = k as keyof typeof score;
        if(score[key]) {
            names.push(categoryName(key));
        }
    }

    return names;
}