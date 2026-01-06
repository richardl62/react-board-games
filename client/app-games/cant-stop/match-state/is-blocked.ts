import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ServerData, SetupOptions } from "@shared/game-control/games/cant-stop/server-data";

export type IsBlockedArg0 = {playerID: string, column: number, height: number};

// Report if the give player if 'mean rule' options prevent a player from stopping with 
// their top pieces in the given columns at the given height. Full columns do not count
// as blocked as the fullness rules are not part of the 'mean rules'. 
export function isBlocked(
    {playerID, column, height}: IsBlockedArg0,
    columnHeights: ServerData["columnHeights"],
    setupOptions: SetupOptions,
): boolean {

    const isHighestOwnedByOther = (col: number, height: number): boolean => {
        for (const pid of Object.keys(columnHeights)) {
            if (pid !== playerID) {
                if (height === columnHeights[pid][col].owned) {
                    return true;
                }
            }
        }
        return false;
    }

    const offsetToCheck: number[] = [];
    for (let offset = 0; offset < setupOptions.minClearanceAbove; offset++) {
        offsetToCheck.push(-offset);
    }
    for (let offset = 0; offset < setupOptions.minClearanceBelow; offset++) {
        offsetToCheck.push(offset);
    }

    for(const offset of offsetToCheck) {
        const hieghtToCheck = height + offset;

        // Players are not considered blocked on columns they have not started.
        if (hieghtToCheck > 0 && isHighestOwnedByOther(column, hieghtToCheck)) {
            return true;
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
            if (isBlocked({ playerID, column: col, height: thisScoringChoice })) {
                result.push(col);
            }
        }
    }
    return result;
}