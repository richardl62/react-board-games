import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "./server-data";


export function setMakeGridStartTime(G: ServerData, ctx: Ctx, startTime: number): void {
    if (G.stage !== GameStage.makingGrids) {
        throw new Error("Unexpected call to setMakeGridState");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    if (G.playerData[playerID].makeGridStartTime !== null) {
        throw new Error("makeGridStartTime already set");
    }
   
    G.playerData[playerID].makeGridStartTime = startTime;
}
