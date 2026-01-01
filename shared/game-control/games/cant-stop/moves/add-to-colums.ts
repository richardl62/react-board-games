import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { maxColumnHeight } from "../config.js";

// Add one to the current height of the given columns for the current player.
// If the height reaches the max height, set it to "full".
export function addToColumns(
    { G, playerID }: MoveArg0<ServerData>,
    columns: number[]  
) : void {

    const hieghts = G.columnHeights[playerID];
    for(const col of columns) {
        const maxHieght = maxColumnHeight(col);
        const currentHieght = hieghts[col].heightThisTurn;

        if (currentHieght !== "full") {
            const newHeight = currentHieght + 1;
            
            if (newHeight >= maxHieght) {
                hieghts[col].heightThisTurn = "full";
            } else {        
                hieghts[col].heightThisTurn = newHeight;
            }
        }
    }
}
