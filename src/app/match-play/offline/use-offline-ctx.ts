import { useState } from "react";
import { MatchDataElem } from "@game-control/board-props";
import { Ctx, ServerCtx } from "@game-control/ctx";
import { EventsAPI } from "@game-control/events";

export function useOfflineCtx(numPlayers: number) : {
    ctx: Ctx, 
    matchData: MatchDataElem[], 
    events: EventsAPI
} {

    const matchData: Required<MatchDataElem>[] = [];
    for (let i = 0; i < numPlayers; i++) {
        matchData.push({
            id: i,
            name: "Player " + i,
            isConnected: true,
        });
    }

    const [ctx, setCtx] = useState(new ServerCtx(numPlayers));
    
    const events : EventsAPI = {
        endTurn: () => {
            ctx.endTurn();
            setCtx(ctx.makeCopy());
        }
    };
    return {ctx, matchData, events};
}