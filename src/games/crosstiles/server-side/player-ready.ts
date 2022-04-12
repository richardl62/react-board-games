import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { selectTiles } from "./select-tiles";
import { GameStage, ServerData } from "./server-data";

export type PlayerReadyArg = void;

export function playerReady(G: ServerData, ctx: Ctx): void {
    if (G.stage !== GameStage.pollingForReady) {
        throw new Error("Unexpected call to playerReady");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    if (!G.playerData[playerID].ready) {
        G.playerData[playerID].ready = true;

        let allReady = true;
        for (const pid in G.playerData) {
            allReady = allReady && G.playerData[pid].ready;
        }

        if (allReady) {
            G.stage = GameStage.makingGrids;
            G.selectedLetters = selectTiles();
        }
    }
}
