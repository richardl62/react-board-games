import { gAssert } from "../../shared/assert";
import { SquareType } from "./square-type";

// KLUDGE?: For now at least, all scrabble configurations use the same letter scores.
export const letterScores = {
    '?': 0,
    A: 1, E: 1, I:1, L:1, N:1, O:1, R:1, S:1, T:1, U:1,
    D:2, G:2,
    B:3, C:3, M:3, P:3,
    F:4, H:4, V:4, W:4, Y:4,
    K: 5,
    J: 8, X: 8,
    Q:10, Z: 10,
}
Object.freeze(letterScore);
export type Letter = keyof typeof letterScores;

// KLUDGE: See comment on letterScores
export const allLetterBonus = 50;

export function letterScore(l: Letter) : number {
    return letterScores[l];
}

const D = SquareType.doubleWord;
const T = SquareType.tripleWord;
const d = SquareType.doubleLetter;
const t = SquareType.tripleLetter;
const s = SquareType.simple;

interface LetterDistribution {
    [key: string]: any;
}

export interface ScrabbleConfig {
    letterDistribution : LetterDistribution;
    boardLayout: SquareType[][];
    rackSize: number;
}


export const standard : ScrabbleConfig = {
    letterDistribution: {
        A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, 
        I: 9, J: 1, K: 1, L: 4, M:  2, N: 6, O: 8, P: 2, 
        Q: 1, R: 6, S: 4, T: 6, U:  4, V: 2, W: 2, X: 1, Y: 2, Z: 1, '?': 2,
    },

    boardLayout: [
        [T, s, s, d, s, s, s, T, s, s, s, d, s, s, T],
        [s, D, s, s, s, t, s, s, s, t, s, s, s, D, s],
        [s, s, D, s, s, s, d, s, d, s, s, s, D, s, s],
        [d, s, s, D, s, s, s, d, s, s, s, D, s, s, d],
        [s, s, s, s, D, s, s, s, s, s, D, s, s, s, s],
        [s, t, s, s, s, t, s, s, s, t, s, s, s, t, s],
        [s, s, d, s, s, s, d, s, d, s, s, s, d, s, s],
        [T, s, s, d, s, s, s, D, s, s, s, d, s, s, T],
        [s, s, d, s, s, s, d, s, d, s, s, s, d, s, s],
        [s, t, s, s, s, t, s, s, s, t, s, s, s, t, s],
        [s, s, s, s, D, s, s, s, s, s, D, s, s, s, s],
        [d, s, s, D, s, s, s, d, s, s, s, D, s, s, d],
        [s, s, D, s, s, s, d, s, d, s, s, s, D, s, s],
        [s, D, s, s, s, t, s, s, s, t, s, s, s, D, s],
        [T, s, s, d, s, s, s, T, s, s, s, d, s, s, T],
    ],

    rackSize: 7,
}
Object.freeze(standard);



// Sanity checks. (Could be debug-only)

gAssert(Object.keys(letterScores).length === 27, "Problem with setup");
gAssert(Object.keys(standard.letterDistribution).length === 27, "Problem with setup");

//KLUDGE: Overly complex - using reduce just of the practice. 
const letterCount : number = Object.entries(standard.letterDistribution).reduce(
    (prevCount, ld) => prevCount + ld[1], 0
)
gAssert(letterCount === 100, "Problem with setup");

gAssert(standard.boardLayout.length === 15);
standard.boardLayout.forEach(row => gAssert(row.length === 15));


export const simple : ScrabbleConfig = {
    letterDistribution: {
        A: 1, B: 1, C: 1, D: 1, E: 1, F: 1, G: 1, H: 1, 
        '?': 2, 
    },

    boardLayout: [
        [t, s, s, s, t,],
        [s, d, s, d, s,],
        [s, s, D, s, s,],
        [s, d, s, d, s,],
        [t, s, s, s, t,],

    ],

    rackSize: 3,
}
Object.freeze(simple);

