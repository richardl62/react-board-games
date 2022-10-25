import { Ctx } from "boardgame.io";
import { GameRequest, PlayerID, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function requestRestartPegging(G: ServerData, ctx: Ctx, playerID: PlayerID): void {
    G[playerID].request = GameRequest.RestartPegging;

    if(G.player0.request === GameRequest.RestartPegging && 
        G.player1.request === GameRequest.RestartPegging) {
        G.player0.request = null;
        G.player1.request = null;

        G.shared.hand = [];
    }
}
