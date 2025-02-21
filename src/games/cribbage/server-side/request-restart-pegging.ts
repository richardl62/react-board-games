import { processGameRequest } from "./process-game-request";
import { GameRequest, PlayerID, ServerData } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function requestRestartPegging(
    {G, ctx} : MoveArg0<ServerData>, 
    playerID: PlayerID
): void {
    if(processGameRequest(G,GameRequest.RestartPegging, ctx, playerID)) {
        G.shared.hand = [];
    }
}
