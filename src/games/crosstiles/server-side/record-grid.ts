import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { Letter } from "../config";
import { ServerData, GameStage } from "./server-data";

export function recordGrid(G: ServerData, ctx: Ctx, grid: Letter[][]): void {
    if (G.stage !== GameStage.pollingForReady) {
        throw new Error("Unexpected call to playerReady");
    }

    const { playerID } = ctx;
    sAssert(playerID);

    G.playerData[playerID].grid = grid.map(row => [...row]);
}