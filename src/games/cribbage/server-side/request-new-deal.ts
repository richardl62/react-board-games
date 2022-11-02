import { Ctx } from "boardgame.io";
import { processGameRequest } from "./process-game-request";   
import { GameRequest, PlayerID, ServerData } from "./server-data";
import { newDealData } from "./starting-server-data";

export function requestNewDeal(inputG: ServerData, ctx: Ctx, playerID: PlayerID): ServerData {
    // If returning a new G, the existing G must not be changed.
    const newG = JSON.parse(JSON.stringify(inputG));

    if (processGameRequest(newG, GameRequest.NewDeal, ctx, playerID)) {
        const ndd = newDealData(ctx, newG);

        const res = {
            ...newG,
            ...ndd,
        };

        return res;
    }

    return newG;
}
