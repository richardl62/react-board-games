import { sAssert } from "../../../utils/assert";

/* For the purposed of the this file, blacks count as letters.
   (Is there a better term to exoress this?)  
*/
export const blank = "?";

export type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" |
    "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "S" |
    "R" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" |
    typeof blank;

export const letters : Letter [] = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "S",
    "R", "T", "U", "V", "W", "X", "Y", "Z",
    blank];   
Object.freeze(letters);

// Convert a string to a Letter if possible, otherwise return null.
// The case of the input string is ignored.
export function makeLetter(str: string) : Letter | null {
    const letter = str.toUpperCase() as Letter;
    if(letters.indexOf(letter) >= 0) {
        return letter;
    }
    return null;
}

// For now at least, all scrabble configurations use the same letter scores.
const letterScores: { [L in Letter]: number } = {
    A: 1, E: 1, I: 1, L: 1, N: 1, O: 1, R: 1, S: 1, T: 1, U: 1,
    D: 2, G: 2,
    B: 3, C: 3, M: 3, P: 3,
    F: 4, H: 4, V: 4, W: 4, Y: 4,
    K: 5,
    J: 8, X: 8,
    Q: 10, Z: 10,
    [blank]: 0,
};
Object.freeze(letterScores);

sAssert(Object.keys(letterScores).length === 27, "Problem with setup");

export function letterScore(letter: Letter): number {
    return letterScores[letter];
}

export const standardLetterSet = (()=>{
    const dist = {
        A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2,
        I: 9, J: 1, K: 1, L: 4, M: 2, N: 6, O: 8, P: 2,
        Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
        [blank]: 2,
    };

    const bag: Array<Letter> = [];
    let letter: Letter;
    for (letter in dist) {
        const count = dist[letter];
        sAssert(count);
        for (let i = 0; i < count; ++i) {
            bag.push(letter);
        }
    }

    return bag;
})();

Object.freeze(standardLetterSet);
sAssert(standardLetterSet.length === 100, "Problem with setup");


