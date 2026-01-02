import { MoveArg0 } from "../../../move-fn.js";
import { ServerData } from "../server-data.js";

export function doEndTurn(
    { G, events }: MoveArg0<ServerData>,
) : void {
    events.endTurn();
    G.rollCount.thisTurn = 0;
}