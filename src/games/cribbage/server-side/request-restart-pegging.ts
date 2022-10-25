import { Ctx } from "boardgame.io";
import { processGameRequest } from "./process-game-request";
import { GameRequest, PlayerID, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function requestRestartPegging(G: ServerData, ctx: Ctx, playerID: PlayerID): void {

    if(processGameRequest(G,GameRequest.RestartPegging, ctx, playerID)) {
        G.shared.hand = [];
    }
}
