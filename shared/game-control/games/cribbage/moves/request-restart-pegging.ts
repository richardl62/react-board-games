import { processGameRequest } from "./process-game-request.js";
import { GameRequest, PlayerID, ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function requestRestartPegging(
    {G, ctx} : MoveArg0<ServerData>, 
    playerID: PlayerID
): void {
    if(processGameRequest(G,GameRequest.RestartPegging, ctx, playerID)) {
        G.shared.hand = [];
    }
}
