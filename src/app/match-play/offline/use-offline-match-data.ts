import { MatchDataElem } from "@shared/game-control/board-props";
import { Ctx } from "@shared/game-control/ctx";
import { useMemo } from "react";

export function useOfflineMatchData(ctx: Ctx): MatchDataElem[] {
    const generate = () => {
        const matchData: Required<MatchDataElem>[] = [];
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