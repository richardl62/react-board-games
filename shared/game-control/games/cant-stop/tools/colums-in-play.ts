import { columnValues } from "../config";
import { ColumnHeight } from "../server-data";

/**
 * List the columns that are in play this turn. 
 */
export function getColumnsInPlay(heights: ColumnHeight[]) : number[] {
    const inPlay: number[] = [];
    for (const col of columnValues) {
        if (heights[col].owned !== heights[col].thisTurn) {
            inPlay.push(col);
        }
    }

    return inPlay;
}