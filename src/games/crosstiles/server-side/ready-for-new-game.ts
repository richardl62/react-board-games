import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData, startingServerData } from "./server-data";
import { startRound } from "./start-round";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function readyForNewGame(G: ServerData, ctx: Ctx, option: void): void {

    const { playerID } = ctx;
    sAssert(playerID);
    
    G.playerData[playerID].readyForNewGame = true;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyForNewGame;
    }

    if (allReady) {
        const newG = startingServerData(ctx);
        newG.options = G.options;
        Object.assign(G, newG);

        G.stage = GameStage.makingGrids;
        startRound(G, ctx);
    }
}
