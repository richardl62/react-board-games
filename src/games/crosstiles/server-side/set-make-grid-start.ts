import { GameStage, ServerData } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function setMakeGridStartTime(
    { G, playerID } : MoveArg0<ServerData>,
    startTime: number): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to setMakeGridState");
    }


    if (G.playerData[playerID].makeGridStartTime !== null) {
        throw new Error("makeGridStartTime already set");
    }
   
    G.playerData[playerID].makeGridStartTime = startTime;
}
