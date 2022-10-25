import { Ctx } from "boardgame.io";
import { GameRequest, PlayerID, ServerData } from "./server-data";
import { newDealData } from "./starting-server-data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function requestNewDeal(inputG: ServerData, ctx: Ctx, playerID: PlayerID): ServerData {
    // If returning a new G, the existing G must not be changed.
    const newG = {...inputG};

    newG[playerID] = {...newG[playerID]};
    newG[playerID].request = GameRequest.NewDeal;
    const ndd = newDealData(ctx, newG);
    console.log("ndd", ndd);
    if (newG.player0.request === GameRequest.NewDeal && 
        newG.player1.request === GameRequest.NewDeal ) {
        const res = {
            ...newG,
            ...ndd,
        };

        console.log("res", res);
        return res;
    }
    console.log("newG", newG);

    return newG;
}
