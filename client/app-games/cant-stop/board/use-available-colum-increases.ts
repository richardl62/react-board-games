import { compareArrays, uniqueValues } from "@/utils/unique-values";
import { useGameContext } from "../game-context";
import { ServerData, ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";
import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { sAssert } from "@shared/utils/assert";

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

/** Find the indices of the full columns. This is judged by heightThisTurn
 * being full for any player.
 */
function fullColumns(heights: ServerData["columnHeights"]) : number[] {
    // Find the full columns
    const result: number[] = [];
    for(const col of columnValues) {
        let full = false;
        
        for(const playerID in heights) {
            const playerHeights = heights[playerID];
            if (playerHeights[col].heightThisTurn === "full") {
                full = true;
            }
        }   
        if (full) {
            result.push(col);
        }
    }

    return result;
}

/** Find the indices of the columns that are in play. 
 * (This means that heightOwned is different from heightThisTurn.) 
 */
function columnsInPlay(heights: ColumnHeight[]) : number[] {
    const inPlay: number[] = [];
    for (const col of columnValues) {
        if (heights[col].heightOwned !== heights[col].heightThisTurn) {
            inPlay.push(col);
        }
    }

    return inPlay;
}

const maxColumnsInPlay = 3;

// Adjust the candidate column options to ensure that
// 1) No full columns are included.
// 2) No more than maxColumnsInPlay columns will be in play if the candidate is used.
function adjustedCandidates(
    candidates: number[][],
    { inPlay, full }: { inPlay: number[], full: number[] }
): number[][] {

    const nonFullCandidates = candidates.map( 
        pair => pair.filter( col => !full.includes(col)) 
    );

    const valid = (candidate: number[]) => {
        const newInPlay = new Set(inPlay);      
        for (const col of candidate) {
            newInPlay.add(col);
        }   
        return newInPlay.size <= maxColumnsInPlay;
    }
    
    const result: number[][] = [];
    for (const candidate of nonFullCandidates) {
        sAssert(candidate.length <= 2, "Expected 2 columns or fewer");
        
        if (valid(candidate)) {
            result.push(candidate);
        } else {
            for(const col of candidate) {
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
export function useAvailableColumnIncreases() : number[][] {
    const {G: {diceValues, columnHeights}, ctx} = useGameContext();
    const full = fullColumns(columnHeights);
    const inPlay = columnsInPlay(columnHeights[ctx.currentPlayer]);

    const candidates = sumsOfPairs(diceValues);

    const adjusted = adjustedCandidates(candidates, {full, inPlay});

    const result = uniqueValues(
        adjusted, 
        (a, b) => compareArrays(a, b, (x, y) => x - y)
    );

    return result;
}