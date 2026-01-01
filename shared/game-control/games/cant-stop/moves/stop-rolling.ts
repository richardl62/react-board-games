import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { columnValues } from "../config.js";

export function stopRolling(
    { G, playerID, events }: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const hieghts = G.columnsHeights[playerID];
    for(const col of columnValues) {
        hieghts[col].heightOwned = hieghts[col].heightThisTurn;
    }

    events.endTurn();
}
