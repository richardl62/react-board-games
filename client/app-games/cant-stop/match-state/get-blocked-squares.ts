import { columnValues, maxColumnHeight } from "@shared/game-control/games/cant-stop/config";
import { ServerData, SetupOptions } from "@shared/game-control/games/cant-stop/server-data";

export function getBlockedSquares(
    columnHeights: ServerData["columnHeights"],
    setupOptions: SetupOptions,
    playerID: string
): boolean[][] {

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

    const isBlocked = (column: number, height: number): boolean => {
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
        return false;
    }

    const result: boolean[][] = [];

    for (const col of columnValues) {
        result[col] = [];

        const maxHeight = maxColumnHeight(col);
        for (let height = 1; height <= maxHeight; height++) {
            result[col][height] = isBlocked(col, height);
        }
    }

    return result;
}