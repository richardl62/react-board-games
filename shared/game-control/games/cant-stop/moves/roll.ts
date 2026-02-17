import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function roll(
    arg0: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const { G, playerID, random } = arg0;
    const heights = G.columnHeights[playerID];

    heights.forEach(h => { h.thisTurn = h.thisScoringChoice;});
  
    for(let i=0; i<G.diceValues.length; i++) {
        G.diceValues[i] = random.Die(6);
    }

    G.rollCount.thisTurn += 1;
    G.rollCount.total += 1;
}
