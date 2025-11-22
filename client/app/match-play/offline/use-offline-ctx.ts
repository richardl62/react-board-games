import { useMemo, useState } from "react";
import { Ctx, makeServerCtx } from "@game-control/ctx";
import { EventsAPI } from "@game-control/events";

export function useOfflineCtx(numPlayers: number) : {
    ctx: Ctx, 
    events: EventsAPI
} {
    const [ctx, setCtx] = useState(makeServerCtx(numPlayers));

    const events : EventsAPI = useMemo(() => ({
        endTurn: () => {
            ctx.endTurn();
            setCtx(ctx.makeCopy());
        },
        endMatch: () => {
            ctx.endMatch();
            setCtx(ctx.makeCopy());
        }
    }), [ctx]);

    return {ctx, events};
}