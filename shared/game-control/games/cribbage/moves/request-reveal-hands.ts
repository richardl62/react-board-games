import { processGameRequest } from "./process-game-request.js";
import { GameRequest, GameStage, PlayerID, ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function requestRevealHands(
    {G, ctx} : MoveArg0<ServerData>, 
    playerID: PlayerID): void {

    if (processGameRequest(G, GameRequest.RevealHand, ctx, playerID)) {
        G.player0.hand = [...G.player0.fullHand];
        G.player1.hand = [...G.player1.fullHand];
        G.shared.hand = G.box;
        G.box = [];

        G.stage = GameStage.HandsRevealed;
    }
}
