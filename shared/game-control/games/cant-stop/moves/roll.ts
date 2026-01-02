import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { commitScoringChoice } from "./utils.js";

export function roll(
    { G, random }: MoveArg0<ServerData>,
    _arg: void  
) : void {
  
    for(let i=0; i<G.diceValues.length; i++) {
        G.diceValues[i] = random.Die(6);
    }

    commitScoringChoice(G);
    G.rollCount.thisTurn += 1;
    G.rollCount.total += 1;
}
