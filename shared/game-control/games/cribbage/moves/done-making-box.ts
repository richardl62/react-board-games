import { MoveArg0 } from "../../../move-fn.js";
import { sAssert } from "../../../utils/assert.js";
import { GameRequest, GameStage, PlayerID, ServerData } from "../server-data.js";
import { processGameRequest } from "./process-game-request.js";

export function doneMakingBox(
    {G, ctx} : MoveArg0<ServerData>, 
    playerID: PlayerID): void {
    sAssert(G.stage === GameStage.SettingBox);

    if (processGameRequest(G, GameRequest.FinishSettingBox, ctx, playerID)) {
        G.player0.fullHand = [...G.player0.hand];
        G.player1.fullHand = [...G.player1.hand];

        G.box = G.shared.hand;

        G.shared.hand = [];
        G.stage = GameStage.Pegging;
    }
}
