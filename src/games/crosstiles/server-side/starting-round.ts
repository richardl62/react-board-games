import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "./server-data";
import { startNextStage } from "./start-next-stage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function readyForNextRound(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.scoring) {
        throw new Error("Unexpected call to readyForNextRound");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].readyForNextRound = true;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyForNextRound;
    }

    if (allReady) {
        startNextStage(G, ctx);
    }
}
