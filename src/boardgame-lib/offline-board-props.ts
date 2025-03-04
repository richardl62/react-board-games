import { useState } from "react";
import { AppGame, BoardProps } from "../app-game-support";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";
import { RequiredServerData } from "../app-game-support/required-server-data";
import { useOfflineCtx } from "./use-offline-ctx";
import { Ctx } from "./ctx";
import { MatchDataElem } from "./board-props";
  
const dummyRandomAPI : RandomAPI = {
    Die: (_spotvalue) => {throw new Error("RandomAPI not implemented");},
    Shuffle: (_deck) => {throw new Error("RandomAPI not implemented");},
};

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

    const startingData = game.setup({ ctx, random: dummyRandomAPI}, setupData);
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
    const {ctx, G, setG} = sharedProps;

    const wrappedMoves: BoardProps["moves"] = {};

    for (const moveName in unwrappedMoves) {
        wrappedMoves[moveName] = (...args: unknown[]) => {
            const newG = JSON.parse(JSON.stringify(G));
            const moveFn = unwrappedMoves[moveName];
            moveFn({
                G: newG,
                ctx,
                playerID: id.toString(),
                random: dummyRandomAPI,
                events: {} as Required<EventsAPI>,
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
