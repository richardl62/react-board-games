import { useState } from "react";
import { AppGame, BoardProps } from "../app-game-support";
import { random } from "./random";
import { EventsAPI } from "./events";
import { RequiredServerData } from "../app-game-support/required-server-data";
import { useOfflineCtx } from "./use-offline-ctx";
import { Ctx } from "./ctx";
import { MatchDataElem } from "./board-props";
  

interface SharedOfflineBoardData {
    ctx: Ctx;
    matchData: Array<MatchDataElem>; 
    events: EventsAPI;
    G: RequiredServerData;
    setG: (newG: RequiredServerData) => void;
}

// Data shared by all offline boards
export function useSharedOfflineBoardData({game, numPlayers, setupData}: {
    game: AppGame, 
    numPlayers: number,
    setupData: unknown,
}) : SharedOfflineBoardData {
    const {ctx, matchData, events} = useOfflineCtx(numPlayers);

    const startingData = game.setup({ ctx, random }, setupData);
    const [G, setG] = useState(startingData);

    return {
        matchData,
        ctx,
        events,
        G,
        setG,
    };
}

// Make the props for an offline board
export function offlineBoardProps(game: AppGame, sharedProps: SharedOfflineBoardData, id: number) : BoardProps {
    const {moves: unwrappedMoves} = game;
    const {ctx, events, G, setG} = sharedProps;

    const wrappedMoves: BoardProps["moves"] = {};

    // KLUDGE: This cast is necessary because EventsAPI has optional member functions.
    // TO DO: Fix this in a better way.
    const requiredEvents: Required<EventsAPI> = events as Required<EventsAPI>; 

    for (const moveName in unwrappedMoves) {
        wrappedMoves[moveName] = (...args: unknown[]) => {
            const newG = JSON.parse(JSON.stringify(G));
            const moveFn = unwrappedMoves[moveName];
            moveFn({
                G: newG,
                ctx,
                playerID: id.toString(),
                random,
                events: requiredEvents,
            }, ...args);
            
            setG(newG);
        };
    }

    return {
        ...sharedProps,
        playerID: id.toString(),
        moves: wrappedMoves,

        credentials: "offline",
        matchID: "offline",
        isConnected: true,
    };
}
