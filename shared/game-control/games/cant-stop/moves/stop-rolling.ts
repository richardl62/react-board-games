import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { columnValues } from "../config.js";
import { doEndTurn } from "./do-end-turn.js";

export function stopRolling(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G, playerID } = arg0;
    const hieghts = G.columnHeights[playerID];
    for(const col of columnValues) {
        hieghts[col].heightOwned = hieghts[col].heightThisTurn;
    }

    doEndTurn(arg0);
}
