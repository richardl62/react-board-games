import assert from "../../shared/assert";

export const squareSize = '30px';

export enum SquareType {
    doubleWord,
    tripleWord,
    doubleLetter,
    tripleLetter,
    simple,
};

const D = SquareType.doubleWord;
const T = SquareType.tripleWord;
const d = SquareType.doubleLetter;
const t = SquareType.tripleLetter;
const s = SquareType.simple;

export const squareTypesArray  = [
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
]

assert(squareTypesArray.length === 15);
squareTypesArray.forEach(row => assert(row.length === 15));

export function squareType(row: number, col: number) : SquareType {
    const type = squareTypesArray[row][col];
    assert(type, "Bad row or column number");
    return type;
}