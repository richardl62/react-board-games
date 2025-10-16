import { MoveArg0 } from "@/game-controlX/move-fn";
import { sAssert } from "@/utils/assert";
import { GameRequest, GameStage, PlayerID, ServerData } from "../server-data";
import { processGameRequest } from "./process-game-request";

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
