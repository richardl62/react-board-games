import { compareArrays, sortUnique } from "@/utils/unique-values";
import { maxColumnsInPlay } from "@shared/game-control/games/cant-stop/config";
import { sAssert } from "@shared/utils/assert";
import { columnsInPlay, fullColumns } from "../utils";
import { ServerData } from "@shared/game-control/games/cant-stop/server-data";
import { Ctx } from "@shared/game-control/ctx";

// Record all the permutaions of digits 0, 1, 2 3
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

// Adjust the candidate options to ensure that
// 1) No full columns are included.
// 2) No more than maxColumnsInPlay columns will be in play if the candidate is used.
// The result will not contain empty candidates but may contain duplicates.
function adjustedCandidates(
    candidates: number[][],
    { inPlay, full }: { inPlay: number[], full: number[] }
): number[][] {

    const valid = (candidate: number[]) => {
        const newInPlay = new Set(inPlay);      
        for (const col of candidate) {
            newInPlay.add(col);
        }   
        return newInPlay.size <= maxColumnsInPlay;
    }
    
    const result: number[][] = [];
    for (const candidate of candidates) {
        sAssert(candidate.length <= 2, "Expected 2 columns or fewer");
        
        const nonFull = candidate.filter( col => !full.includes(col));
        if (nonFull.length === 0) {
            continue;
        }
        else if (valid(nonFull)) {
            result.push(nonFull);
        } else {
            for(const col of nonFull) {
                if (valid([col])) {
                    result.push([col]);
                }   
            }
        }
    }

    return result;
}

// Returns an array of arrays with each inner array recording the indices of the
// columns for which the current player can choose to increase the height.
export function getAvailableColumnIncreases(G: ServerData, ctx: Ctx) : number[][] {
    const {diceValues, columnHeights} = G;

    const candidates = sumsOfPairs(diceValues);

    const adjusted = adjustedCandidates(candidates, {
        full: fullColumns(columnHeights), 
        inPlay: columnsInPlay(columnHeights[ctx.currentPlayer])
    });

    const result = sortUnique(
        adjusted, 
        (a, b) => compareArrays(a, b, (x, y) => x - y)
    );

    return result;
}