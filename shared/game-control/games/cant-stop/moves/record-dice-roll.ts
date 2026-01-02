import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { maxColumnHeight } from "../config.js";
import { clearScoringChoice } from "./utils.js";

// Add one to the current height of the given columns for the current player.
// If the height reaches the max height, set it to "full".
export function recordScoringChoice(
    arg0: MoveArg0<ServerData>,
    columns: number[]  
) : void {
    const { G, playerID } = arg0;
    const heights = G.columnHeights[playerID];

    // Clear any previous scoring choice.
    clearScoringChoice(G);

    // Record the new scoring choice.
    for(const col of columns) {
        const currentHieght = heights[col].thisScoringChoice;

        if (currentHieght !== "full") {
            const newHeight = currentHieght + 1;
            
            if (newHeight >= maxColumnHeight(col)) {
                heights[col].thisScoringChoice = "full";
            } else {        
                heights[col].thisScoringChoice = newHeight;
            }
        }
    }
}
