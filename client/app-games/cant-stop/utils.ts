import { ServerData } from "@shared/game-control/games/cant-stop/server-data";
import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { ColumnHeight } from "@shared/game-control/games/cant-stop/server-data";

/** Find the indices of the full columns. This is judged by heightThisTurn
 * being full for any player.
 */
export function fullColumns(heights: ServerData["columnHeights"]) : number[] {
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
 * This means that heightOwned is different from heightThisTurn. 
 */
export function columnsInPlay(heights: ColumnHeight[]) : number[] {
    const inPlay: number[] = [];
    for (const col of columnValues) {
        if (heights[col].heightOwned !== heights[col].heightThisTurn) {
            inPlay.push(col);
        }
    }

    return inPlay;
}