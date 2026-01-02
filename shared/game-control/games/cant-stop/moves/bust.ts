import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { clearUnownedScores, doEndTurn } from "./utils.js";

// Call by a player to acknowledge that they are bust.
export function bust(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G } = arg0;

    clearUnownedScores(G);
    doEndTurn(arg0);
}
