import { compareArrays, uniqueValues } from "@/utils/unique-values";
import { useGameContext } from "../game-context";

// Record all the permutaions of digit 0-3
const permuations = [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [0, 2, 1, 3],
    [0, 2, 3, 1],
    [0, 3, 1, 2],
    [0, 3, 2, 1],
    [1, 0, 2, 3],
    [1, 0, 3, 2],
    [1, 2, 0, 3],
    [1, 2, 3, 0],
    [1, 3, 0, 2],
    [1, 3, 2, 0],
    [2, 0, 1, 3],
    [2, 0, 3, 1],
    [2, 1, 0, 3],
    [2, 1, 3, 0],
    [2, 3, 0, 1],
    [2, 3, 1, 0],
    [3, 0, 1, 2],
    [3, 0, 2, 1],
    [3, 1, 0, 2],
    [3, 1, 2, 0],
    [3, 2, 0, 1],
    [3, 2, 1, 0],
]

function sumsOfPairs(values: number[]) : number[][] {
    const results: number[][] = []
    for (const permuation of permuations) {

        const pair = [
            values[permuation[0]] + values[permuation[1]], 
            values[permuation[2]] + values[permuation[3]]
        ];
        results.push(pair.sort());
    }
    return results
}

// Returns an array of arrays with each inner array recording the indices of the
// columns for which the current player can choose to increase the height.
export function useAvailableColumnIncreases() : number[][] {
    const {G: {diceValues}} = useGameContext();

    const pairs = sumsOfPairs(diceValues);

    return  uniqueValues(pairs, (a, b) => compareArrays(a, b, (x, y) => x - y));
}