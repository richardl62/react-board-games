import { sAssert } from "../../../../utils/assert.js";
import { MoveArg0 } from "../../../move-fn.js";
import { ServerData } from "../server-data.js";

export function doEndTurn(
    { G, events }: MoveArg0<ServerData>,
) : void {
    
    // Check that all column heights are consistent. It is up to the calling code to ensure this.
    for (const playerID in G.columnHeights) {
        G.columnHeights[playerID].forEach(h => {
            sAssert(h.thisTurn === h.thisScoringChoice && h.thisTurn === h.owned,
                "Column heights are not consistent at end of turn."
            );
        });
    } 

    events.endTurn();
    G.rollCount.thisTurn = 0;
}