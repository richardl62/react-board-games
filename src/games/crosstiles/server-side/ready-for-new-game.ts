import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData, startingServerData } from "./server-data";
import { startRound } from "./start-round";

export function readyForNewGame(G: ServerData, ctx: Ctx, _option: void): void {

    const { playerID } = ctx;
    sAssert(playerID);
    
    G.playerData[playerID].readyForNewGame = true;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyForNewGame;
    }

    if (allReady) {
        const newG = startingServerData(ctx, G.options);
        Object.assign(G, newG);

        G.stage = GameStage.makingGrids;
        startRound(G, ctx);
    }
}
