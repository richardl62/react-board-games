import { GameStage, ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function setMakeGridStartTime(
    { G, playerID } : MoveArg0<ServerData>,
    startTime: number): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error(`Unexpected call to setMakeGridStateTime when stage is ${G.stage}`);
    }

    const playerData = G.playerData[playerID];
    if (playerData.makeGridStartTime !== null && playerData.makeGridStartTime !== startTime) {
        throw new Error(`Unexpected value for makeGridStartTime: ` +
            `Current ${playerData.makeGridStartTime} new ${startTime}`);
    }
   
    G.playerData[playerID].makeGridStartTime = startTime;
}
