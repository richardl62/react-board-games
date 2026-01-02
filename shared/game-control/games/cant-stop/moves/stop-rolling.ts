import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { commitScoreThisTurn, commitScoringChoice, doEndTurn } from "./utils.js";

export function stopRolling(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G } = arg0;

    commitScoringChoice(G);
    commitScoreThisTurn(G)
    doEndTurn(arg0);
}
