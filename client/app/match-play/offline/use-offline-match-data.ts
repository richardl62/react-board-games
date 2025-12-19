import { Ctx } from "@shared/game-control/ctx";
import { PublicPlayerMetadata } from "@shared/lobby/types";
import { useMemo } from "react";

export function useOfflineMatchData(ctx: Ctx): PublicPlayerMetadata[] {
    const generate = () => {
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
    return useMemo(generate, [ctx.numPlayers, ctx.playOrder]);
}