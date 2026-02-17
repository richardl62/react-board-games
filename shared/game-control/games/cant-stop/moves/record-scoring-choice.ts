import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { maxColumnHeight } from "../config.js";

// Add one to the current height of the given columns for the current player.
// If the height reaches the max height, set it to "full".
export function recordScoringChoice(
    arg0: MoveArg0<ServerData>,
    columns: number[]  
) : void {
    const { G, playerID } = arg0;
    const heights = G.columnHeights[playerID];

    // Clear any previous scoring choice.
    heights.forEach(h => { h.thisScoringChoice = h.thisTurn; });

    // Record the new scoring choice.
    for(const col of columns) {
        const currentHeight = heights[col].thisScoringChoice;

        // In general, it shouldn't be possible to select a full column. But if a player selects
        // a double (e.g. two 6s) a columns might be filled by the first of these numbers.
        if (currentHeight !== "full") {
            const newHeight = currentHeight + 1;
            
            if (newHeight >= maxColumnHeight(col)) {
                heights[col].thisScoringChoice = "full";
            } else {        
                heights[col].thisScoringChoice = newHeight;
            }
        }
    }
}
