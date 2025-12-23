import { SetupArg0 } from "../../game-control.js";
import { valuesPerPlayer, maxValue } from "./config.js";

export interface ServerData {
    playerValues: {[playerID: string]: number[]};
}

export function startingServerData(arg0: SetupArg0): ServerData {
    const {ctx, random} = arg0;
    
    const playerValues : ServerData["playerValues"] = {}; 

    for(const pid in ctx.playOrder) {
        playerValues[pid] = [];
        for(let i=0; i<valuesPerPlayer; i++) {
            playerValues[pid].push(random.Die(maxValue));
        }
    }
    
    return {
        playerValues,
    }
}
