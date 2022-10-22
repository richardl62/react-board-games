import { Ctx } from "boardgame.io";
import { GameStage, PlayerID, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function requestRevealHands(G: ServerData, ctx: Ctx, playerID: PlayerID): void {

    G[playerID].revealHandsRequested = true;


    if (G.player0.revealHandsRequested && G.player1.revealHandsRequested) {
        G.player0.hand = [...G.player0.fullHand];
        G.player1.hand = [...G.player1.fullHand];
        G.shared.hand = G.box;
        G.box = [];

        G.stage = GameStage.HandsRevealed;
    }
}
