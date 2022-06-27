import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "./server-data";
import { startNextStage } from "./start-next-stage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function readyToStartGame(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.starting) {
        throw new Error("Unexpected call to readyToStartGame");
    }

    const { playerID } = ctx;
    sAssert(playerID);


    G.playerData[playerID].readyToStartGame = true;
    G.playerData[playerID].grid = null;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyToStartGame;
    }

    if (allReady) {
        startNextStage(G, ctx);
    }
}
