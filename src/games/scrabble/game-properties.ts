import assert from "../../shared/assert";
import { SquareType } from "./square-type";

const letterScores = {
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

export function letterScore(l: Letter) : number {
    return letterScores[l];
}

const letterDistribution = {
    A:9, B:2, C:2, D:4, E:12, F:2, G:3, H:2, I:9, J:1, K:1, L:4, M:2, N:6, O:8, P:2, Q:1, R:6, S:4, T:6, U:4, V:2, W:2, X:1, Y:2, Z:1, '?':2, 
};
Object.freeze(letterDistribution);

export let fullBag: Array<Letter> = [];
for(const letter_ in letterDistribution) {
    const letter = letter_ as keyof typeof letterDistribution;
    const count = letterDistribution[letter];
    for(let i = 0; i < count; ++i) {
        fullBag.push(letter);
    }
} 
Object.freeze(fullBag);

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
Object.freeze(squareTypesArray);

export const rackSize = 7;

// Sanity checks. (Could be debug-only)
assert(squareTypesArray.length === 15);
squareTypesArray.forEach(row => assert(row.length === 15));

assert(Object.keys(letterScores).length === 27, "Problem with setup");
assert(Object.keys(letterDistribution).length === 27, "Problem with setup");
assert(fullBag.length === 100, "Problem with setup");

