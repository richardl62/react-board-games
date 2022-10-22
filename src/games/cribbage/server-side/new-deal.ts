import { Ctx } from "boardgame.io";
import { PlayerID, ServerData } from "./server-data";
import { newDealData } from "./starting-server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function newDeal(inputG: ServerData, ctx: Ctx, playerID: PlayerID): ServerData {
    // If returning a new G, the existing G must not be changed.
    const newG = {...inputG};

    newG[playerID] = {...newG[playerID]};
    newG[playerID].newDealRequested = true;

    if (newG.player0.newDealRequested && newG.player1.newDealRequested) {
        return {
            ...newG,
            ...newDealData(newG),
        };
    }

    return newG;
}
