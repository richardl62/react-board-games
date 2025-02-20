import { Ctx } from "../../../boardgame-lib/ctx";
import { GameRequest, PlayerID, ServerData } from "./server-data";

/** Process a game request (e,g, from a new deal).
 * If all players have made the same requestm, return true and clear the recorded
 * requests. Otherwise, record the request.
 */
export function processGameRequest(
    G: ServerData,
    request: GameRequest,
    ctx: Ctx,
    playerID: PlayerID): boolean {

    G[playerID].request = request;
    if (ctx.numPlayers === 1 ||
        (G.player0.request === request && G.player1.request === request)) {
        G.player0.request = null;
        G.player1.request = null;

        return true;
    }

    return false;
}
