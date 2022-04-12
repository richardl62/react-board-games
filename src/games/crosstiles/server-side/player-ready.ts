import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { selectTiles } from "./select-tiles";
import { GameStage, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playerReady(G: ServerData, ctx: Ctx, arg: void): void {
    if (G.stage !== GameStage.pollingForReady) {
        throw new Error("Unexpected call to playerReady");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    if (G.playerData[playerID].ready) {
        return;
    }

    G.playerData[playerID].ready = true;
    G.playerData[playerID].grid = null;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].ready;
    }

    if (allReady) {
        G.stage = GameStage.makingGrids;
        G.selectedLetters = selectTiles();
    }
}
