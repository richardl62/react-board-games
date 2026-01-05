import { ServerData, SetupOptions } from "@shared/game-control/games/cant-stop/server-data";

// Report if the give player is blocked from stopping with their top pieces
// in the given columns at the given height.
export function isBlocked(
    {playerID, column, height}: {playerID: string, column: number, height: number},
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

    // Players are not considered blocked on columns they haven't started.
    if (height > 0) {
        for (let offset = 0; offset < setupOptions.minClearanceAbove; offset++) {
            if (isHighestOwnedByOther(column, height + offset)) {
                return true;
            }
        }
        for (let offset = 0; offset < setupOptions.minClearanceBelow; offset++) {
            if (isHighestOwnedByOther(column, height - offset)) {
                return true;
            }
        }
    }

    return false;
}