import { AppGame } from "@/app-game-support";
import { MatchDataElem } from "@shared/game-control/board-props";
import { Ctx } from "@shared/game-control/ctx";
import { EventsAPI } from "@shared/game-control/events";
import { RandomAPI, seededDraw } from "@shared/game-control/random-api";
import { RequiredServerData } from "@shared/game-control/required-server-data";
import { useMemo, useState } from "react";
import { useOfflineCtx } from "./use-offline-ctx";

export interface SharedOfflineBoardData {
    ctx: Ctx;
    matchData: Array<MatchDataElem>;
    events: EventsAPI;
    G: RequiredServerData;
    setG: (newG: RequiredServerData) => void;
    random: RandomAPI;
}

// Data shared by all offline boards
export function useSharedOfflineBoardData({ game, numPlayers, setupData }: {
    game: AppGame;
    numPlayers: number;
    setupData: unknown;
}): SharedOfflineBoardData {
    const { ctx, matchData, events } = useOfflineCtx(numPlayers);

    const [seed] = useState(Math.random());
    const draw = useMemo(() => {
        return seededDraw(seed);
    }, [seed]);
    
    const random = new RandomAPI(draw);

    const startingData = game.setup({ ctx, random }, setupData);
    const [G, setG] = useState(startingData);

    return {
        matchData,
        ctx,
        events,
        G,
        setG,
        random,
    };
}
