import { processGameRequest } from "./process-game-request";   
import { GameRequest, PlayerID, ServerData } from "./server-data";
import { newDealData } from "./starting-server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function requestNewDeal(
    {G: inputG, ctx, random} : MoveArg0<ServerData>,  
    playerID: PlayerID): ServerData {
    // If returning a new G, the existing G must not be changed.
    const newG = JSON.parse(JSON.stringify(inputG));

    if (processGameRequest(newG, GameRequest.NewDeal, ctx, playerID)) {
        const ndd = newDealData(newG, random);

        const res = {
            ...newG,
            ...ndd,
        };

        return res;
    }

    return newG;
}
