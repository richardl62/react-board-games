import { DiceScore } from "./dice-score";

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

export function scoringCategoryNames(score: DiceScore): string[] {
    const names: string[] = [];
    for (const k in score) {
        const key = k as keyof typeof score;
        if (score[key]) {
            names.push(categoryName(key));
        }
    }

    return names;
}
