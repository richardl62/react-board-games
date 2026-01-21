import { AppGame } from "@/app-game-support";
import { OptionValues } from "@/option-specification/types";
import { Ctx, makeCtxData } from "@shared/game-control/ctx";
import { PublicPlayerMetadata } from "@shared/lobby/types";
import { ServerMatchData } from "@shared/server-match-data";
import { RandomAPI } from "@shared/utils/random-api";

export interface OfflineMatchData extends ServerMatchData {
    /** An error reported by the last action (i.e. move or event), or null if there was no
     * reported error. */
    errorInLastAction: string | null;
}

function playerData(ctx: Ctx): PublicPlayerMetadata[] {

    const matchData: PublicPlayerMetadata[] = [];
    for (let playerPos = 0; playerPos < ctx.numPlayers; playerPos++) {
        const id = ctx.playOrder[playerPos];
        matchData.push({
            id,
            name: "Player " + id,
            isConnected: true,
        });
    }
    return matchData;
}

// make a ServerMatchData suitable for the start of an offline match.
export function makeInitialMatchData(
    game: AppGame, 
    numPlayers: number, 
    random: RandomAPI, 
    options: OptionValues
): OfflineMatchData {
    const ctxData = makeCtxData(numPlayers);
    const ctx = new Ctx(ctxData);
    return {
        playerData: playerData(ctx),
        ctxData: ctx.data,
        state: game.setup({ ctx, random }, options),
        errorInLastAction: null,
    };
}
