/* Some of this code is a copy-and-edit of config code for Scrabble */
import { sAssert } from "../../utils/assert";

export type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" |
    "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "S" |
    "R" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

/** As Scabble, but no blank */ 
export const letterDistrubtion = {
    A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2,
    I: 9, J: 1, K: 1, L: 4, M: 2, N: 6, O: 8, P: 2,
    Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
};

sAssert(Object.keys(letterDistrubtion).length === 26);

/** The number of tiles available to players when forming words */
export const nTilesPerTurn = 8; 

export const maxTimeToMakeGrid = 10; /* For now */




