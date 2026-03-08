import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ServerData, SetupOptions } from "@shared/game-control/games/cant-stop/server-data";
import { sAssert } from "@shared/utils/assert";

export interface IsBlockedArg0 {playerID: string, column: number, height: number}

// Check if 'mean rule' options prevent a player from stopping with 
// their top pieces in the given columns at the given height. Full columns do not count
// as blocked as the fullness rules are not part of the 'mean rules'. 
export function isBlocked(
    {playerID, column, height}: IsBlockedArg0,
    columnHeights: ServerData["columnHeights"],
    {minClearanceAbove, minClearanceBelow}: SetupOptions,
): boolean {
    const ownedByPlayer = columnHeights[playerID][column].owned;
    if(ownedByPlayer === "full" || ownedByPlayer > height) {
        return false;
    }

    for (const pid of Object.keys(columnHeights)) {
        if (pid !== playerID) {
            const ownedByOther = columnHeights[pid][column].owned;
            if (ownedByOther !== 0 && ownedByOther !== "full") {
                const otherHeight = ownedByOther - 1;
                
                const clearanceAbove = height - otherHeight;
                if (clearanceAbove >= 0 && clearanceAbove < minClearanceAbove)
                {
                    return true;
                }

                const clearanceBelow = otherHeight - height;
                if (clearanceBelow >= 0 && clearanceBelow < minClearanceBelow)
                {
                    return true;
                }
            }
        }
    }

    return false;
}

export function blockedColumns(
    columnHeights: ServerData["columnHeights"],
    playerID: string,
    isBlocked: (args: IsBlockedArg0) => boolean,
) : number[] {
    const result: number[] = [];

    for (const col of columnValues) {
        const { owned, thisScoringChoice } = columnHeights[playerID][col];
        
        // Players can be blocked only on columns that are in play this turn,
        // and cannot be blocked on full columns.
        if (thisScoringChoice > owned && thisScoringChoice !== "full") {
            sAssert(thisScoringChoice > 0, "Unexpected value for thisScoringChoice");

            if (isBlocked({ playerID, column: col, height: thisScoringChoice - 1 })) {
                result.push(col);
            }
        }
    }
    return result;
}