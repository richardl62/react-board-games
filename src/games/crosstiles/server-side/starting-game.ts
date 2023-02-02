import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "./server-data";
import { startRound } from "./start-round";

export function readyToStartGame(G: ServerData, ctx: Ctx, _arg: void): void {
    if (G.stage !== GameStage.starting) {
        throw new Error("Unexpected call to readyToStartGame");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].readyToStartGame = true;
    G.playerData[playerID].gridRackAndScore = null;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyToStartGame;
    }

    if (allReady) {
        G.stage = GameStage.makingGrids;
        startRound(G, ctx);
    }
}
