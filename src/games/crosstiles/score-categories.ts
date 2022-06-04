import { bonusLetters, bonusScore } from "./config";

export type FixedScoreCategory =   "length4" | "length5" | "length6" | "words2" | "words3";
export type ScoreCategory =  FixedScoreCategory | "chance" | "bonus";
export type ScoreCategoryOrTotal =  ScoreCategory | "total";

export const fixedScoreCategories : FixedScoreCategory [] = [
    "length4", "length5", "length6", "words2", "words3"
];

export const scoreCategories : ScoreCategory [] = [...fixedScoreCategories,  "chance", "bonus"];

export const displayName: {[category in ScoreCategoryOrTotal] : string} = {
    length4: "4 letter word",
    length5: "5 letter word",
    length6: "6 letter word",
    words2: "2 words",
    words3: "3+ words",
    chance: "Chance",
    bonus: "Bonus",
    total: "TOTAL",
};

export const categoryDescription: {[category in ScoreCategoryOrTotal] : string} = {
    length4: "A single word of exactly 4 letters",
    length5: "A single word of exactly 5 letters",
    length6: "A single word of exactly 6 letters",
    words2: "A 4 letter word crossing a 3 letter word",
    words3: "3+ word crossword. Must use 6 titles",
    chance: "Repeat a previously scored category",
    bonus: `A ${bonusScore} point bonus for each special letters
    (${bonusLetters.join(", ")}) in a valid grid`,
    total: "The total score so far",
};

export const fixedScores: {[category in FixedScoreCategory] : number} = {
    length4: 20,
    length5: 30,
    length6: 50,
    words2: 30,
    words3: 30,
};
