import { gAssert } from "../../shared/assert";
import { SquareType } from "./square-type";

const D = SquareType.doubleWord;
const T = SquareType.tripleWord;
const d = SquareType.doubleLetter;
const t = SquareType.tripleLetter;
const s = SquareType.simple;

export const squareTypesArray = [
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
];
Object.freeze(squareTypesArray);

export const rackSize = 7;
// Sanity checks. (Could be debug-only)
gAssert(squareTypesArray.length === 15);
squareTypesArray.forEach(row => gAssert(row.length === 15));

export const allLetterBonus = 50;
