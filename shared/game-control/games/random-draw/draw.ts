import { ServerData } from "./server-data.js";
import { MoveArg0 } from "../../move-fn.js";
import { maxValue } from "./config.js";

export function draw(
    { G, playerID, events, random }: MoveArg0<ServerData>,
    _arg: void  
) : void {
    const values = G.playerValues[playerID];
    if(!values) {
        throw new Error(`No values for playerID ${playerID}`);
    }

    for(let i=0; i<values.length; i++) {
        values[i] = random.Die(maxValue);
    }

    events.endTurn();
}
