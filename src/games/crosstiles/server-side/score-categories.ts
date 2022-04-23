export type ScoreCategory =   "length3" | "length4" | "length5";
export const scoreCategories : ScoreCategory [] = ["length3",  "length4" , "length5"];

export type ScoreCard = {[category in ScoreCategory]? : number};

/* To help with testing */
export function startingScoreCard() : ScoreCard {
    return {
        length3: 30,
        length4: 0,
    };
}

export function displayName(category: ScoreCategory): string {
    switch (category) {
    case "length3":
        return "Length 3";
    case "length4":
        return "Length 4";
    case "length5":
        return "Length 5";
    }
}