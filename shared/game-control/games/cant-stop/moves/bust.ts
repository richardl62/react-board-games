import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { columnValues } from "../config.js";

// Call by a player to acknowledge that they are bust.
export function bust(
    { G, playerID, events }: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const hieghts = G.columnsHeights[playerID];
    for(const col of columnValues) {
        hieghts[col].heightThisTurn = hieghts[col].heightOwned;
    }

    events.endTurn();
}
