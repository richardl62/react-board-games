import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { doEndTurn } from "./end-turn.js";

export function stopRolling(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G, playerID } = arg0;
    const heights = G.columnHeights[playerID];

    heights.forEach(h => { h.owned = h.thisTurn = h.thisScoringChoice; });

    G.scoringOptions.options = [];
    G.scoringOptions.chosen = "rollRequired";

    doEndTurn(arg0);
}
