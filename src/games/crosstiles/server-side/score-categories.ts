export type ScoreCategory =   "length4" | "length5" | "length6" | "words2" | "words3" | "kind6" | "chance" | "bonus";
export const scoreCategories : ScoreCategory [] = [
    "length4", "length5", "length6", "words2", "words3", "kind6", "chance", "bonus"
];

export type ScoreCard = {[category in ScoreCategory]? : number};

export const displayName: {[category in ScoreCategory] : string} = {
    length4: "4 letter word",
    length5: "5 letter word",
    length6: "6 letter word",
    words2: "2 words",
    words3: "3+ words",
    kind6: "6 of a kind",
    chance: "Chance",
    bonus: "Bonus",
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