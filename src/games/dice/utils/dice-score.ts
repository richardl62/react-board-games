export interface DiceScore {
    allSame: number;
    allDifferent: number;
    threeOfAKind: number;
    threePairs: number;
    aces: number;
    fives: number;
}

export function categoryName(category: keyof DiceScore): string {
    switch (category) {
    case "allSame": return "All the same";
    case "allDifferent": return "All different";
    case "threeOfAKind": return "Three of a kind";
    case "threePairs": return "Three pairs";
    case "aces": return "Aces";
    case "fives": return "Fives";
    }
}
