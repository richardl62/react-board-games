import { bonusLetters, bonusScore } from "./config";

export type FixedScoreCategory =   "length4" | "length5" | "length6" | "words2" | "words3";
export type ScoreCategory =  FixedScoreCategory | "chance" | "bonus";

export const fixedScoreCategories : FixedScoreCategory [] = [
    "length4", "length5", "length6", "words2", "words3"
];

export const scoreCategories : ScoreCategory [] = [...fixedScoreCategories,  "chance", "bonus"];


export const displayName: {[category in ScoreCategory] : string} = {
    length4: "4 letter word",
    length5: "5 letter word",
    length6: "6 letter word",
    words2: "2 words",
    words3: "3+ words",
    chance: "Chance",
    bonus: "Bonus",
};

export const categoryDescription: {[category in ScoreCategory] : string} = {
    length4: "A single word of exactly 4 letters",
    length5: "A single word of exactly 5 letters",
    length6: "A single word of exactly 6 letters",
    words2: "A 4 letter word crossing a 3 letter word",
    words3: "A connected grid with 3 or more words",
    chance: "Repeat a previously scored category",
    bonus: `A ${bonusScore} point bonus for each of the special letters
    (${bonusLetters.join(", ")}) that appears in a valid grid`,
    
};

export const fixedScores: {[category in FixedScoreCategory] : number} = {
    length4: 20,
    length5: 30,
    length6: 50,
    words2: 30,
    words3: 30,
};

/*
30 : 5 letter word
50 : 6 letter word
30 : 2 word crossword - must be a 3 letter word crossing a 4 letter word.
30 : 3+ word crossword - using six titles.
20 : 6 vowels or 6 consonants (Y is either. Does not have to be a word.)
? : Chance. (Repeat of any category already that has already been scored. This scores the same as for the repeated category.  Cannot be used with categories that have been given scores of zero.)
10 : Bonus for each use of a tile with a scrabble score of 5 or more (K, X, J, Q, Z), but not in the 6 vowels or 6 consonants category.
*/