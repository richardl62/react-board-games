import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { doEndTurn } from "./end-turn.js";

// Call by a player to acknowledge that they are bust.
export function bust(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G, playerID } = arg0;
    const heights = G.columnHeights[playerID];

    // Clear any previous scoring choice.
    heights.forEach(h => {
        h.thisScoringChoice = h.thisTurn = h.owned;
    });

    doEndTurn(arg0);
}
