import { Ctx } from "boardgame.io";
import { PlayerID, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function requestRestartPegging(G: ServerData, ctx: Ctx, playerID: PlayerID): void {
    G[playerID].restartPeggingRequested = true;

    if(G.player0.restartPeggingRequested && G.player1.restartPeggingRequested) {
        G.player0.restartPeggingRequested = false;
        G.player1.restartPeggingRequested = false;

        G.shared.hand = [];
    }
}
