import { useState } from "react";
import { AppGame, BoardProps } from "../app-game-support";
import { Ctx } from "./ctx";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";
import { RequiredServerData } from "../app-game-support/required-server-data";
import { useOfflineCtx } from "./use-offline-ctx";
  
const dummyRandomAPI : RandomAPI = {
    Die: (_spotvalue) => {throw new Error("RandomAPI not implemented");},
    Shuffle: (_deck) => {throw new Error("RandomAPI not implemented");},
};

function wrapMoves(
    unwrappedMoves: AppGame["moves"], 
    ctx: Ctx, 
    id: number, 
    G: RequiredServerData, 
    setG: (newG: RequiredServerData) => void
) : BoardProps["moves"] {

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
    return wrappedMoves;
}

export function useOfflineBoardProps({game, numPlayers, id}: {
    game: AppGame, 
    numPlayers: number
    id: number, 
}) : Required<BoardProps> {
    const {ctx, matchData, events} = useOfflineCtx(numPlayers);

    const startingData = game.setup({ ctx, random: dummyRandomAPI}, 
        undefined /* TEMPORARY HACK */ 
    );
    const [G, setG] = useState(startingData);

    return {
        playerID: id.toString(),
        credentials: "offline",
        matchID: "offline",
        matchData,
        ctx,
        moves: wrapMoves(game.moves, ctx, id, G, setG),
        events,
        isConnected: true,
        G,
    };
} 
