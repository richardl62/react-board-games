import { compareArrays, sortUnique } from "@/utils/unique-values";
import { maxColumnsInPlay } from "@shared/game-control/games/cant-stop/config";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";
import { PlayerID } from "@shared/game-control/playerid";
import { sAssert } from "@shared/utils/assert";

function sumsOfPairs(values: number[]) : number[][] {
    // There are only 3 unique ways to partition the 4 dice into pairs.
    const pairs = [
        [values[0] + values[1], values[2] + values[3]],
        [values[0] + values[2], values[1] + values[3]],
        [values[0] + values[3], values[1] + values[2]],
    ];

    // Ensure canonical order (e.g. [2, 10] instead of [10, 2])
    return pairs.map(pair => pair.sort((a, b) => a - b));
}

// Adjust the candidate options to ensure that
// 1) No full columns are included.
// 2) No more than maxColumnsInPlay columns will be in play if the candidate is used.
// The result will not contain empty candidates but may contain duplicates.
function adjustedCandidates(
    candidates: number[][],
    { inPlay, isFull }: { 
        inPlay: number[], 
        isFull: (col: number, category: keyof ColumnHeight) => PlayerID | undefined}
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
        
        const nonFull = candidate.filter( col => !isFull(col, "thisTurn"));
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
export function getScoringOptions({diceValues, isFull, columnsInPlay}: {
    diceValues: number[], 
    isFull: (col: number, category: keyof ColumnHeight) => PlayerID | undefined, 
    columnsInPlay: number[]
}
) : number[][] {

    const candidates = sumsOfPairs(diceValues);

    const adjusted = adjustedCandidates(candidates, {
        isFull, 
        inPlay: columnsInPlay
    });

    const result = sortUnique(
        adjusted, 
        (a, b) => compareArrays(a, b, (x, y) => x - y)
    );

    return result;
}