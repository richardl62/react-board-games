import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { columnValues } from "../config.js";
import { doEndTurn } from "./do-end-turn.js";

// Call by a player to acknowledge that they are bust.
export function bust(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G, playerID } = arg0;

    const hieghts = G.columnHeights[playerID];
    for(const col of columnValues) {
        hieghts[col].heightThisTurn = hieghts[col].heightOwned;
    }

    doEndTurn(arg0);
}
