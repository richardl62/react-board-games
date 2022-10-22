import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameStage, PlayerID, ServerData } from "./server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function doneMakingBox(G: ServerData, ctx: Ctx, playerID: PlayerID): void {
    sAssert(G.stage === GameStage.SettingBox);
    G[playerID].doneSettingBox = true;


    if (G.player0.doneSettingBox && G.player1.doneSettingBox) {
        G.player0.fullHand = [...G.player0.hand];
        G.player1.fullHand = [...G.player1.hand];

        G.box = G.shared.hand;

        G.shared.hand = [];
        G.stage = GameStage.Pegging;
    }
}
