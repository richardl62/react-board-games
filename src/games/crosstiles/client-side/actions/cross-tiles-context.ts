import React, { Dispatch } from "react";
import { WrappedGameProps } from "../../../../app-game-support";
import { sAssert } from "../../../../utils/assert";
import { ActionType, ReducerState } from "./cross-tiles-reducer";
import { ClientMoves } from "../../server-side/moves";
import { ServerData } from "../../server-side/server-data";
import { CrossTilesGameProps } from "./cross-tiles-game-props";

// Return an array of player IDs starting with G.
function makePlayerIDs(G: ServerData, first: string) {
    const pids: string[] = [];
    for(const pid in G.playerData) {
        pids.push(pid);
    }

    sAssert(pids.includes(first));

    while(pids[0] !== first) {
        pids.push(pids.shift()!);
    }

    // Return an interable object. This is intended to reduce the chance of
    // subtle bugs if for...in is used rather than for...of
    return  {
        *[Symbol.iterator]() {
            yield *pids;
        },

        length: pids.length,
    };
}

export interface CrossTilesContext extends ServerData, ReducerState{
    readonly wrappedGameProps: WrappedGameProps<unknown, ClientMoves>; // Bgio properties other than game state

    readonly dispatch:  Dispatch<ActionType>;

    readonly orderedPlayerIDs: ReturnType<typeof makePlayerIDs>,
    
    readonly isLegalWord: (word: string) => boolean;
}

export const ReactCrossTilesContext = React.createContext<CrossTilesContext|null>(null);

export function useCrossTilesContext() : CrossTilesContext {
    const context = React.useContext(ReactCrossTilesContext);
    sAssert(context);

    return context;
}

export function makeCrossTilesContext(
    crossTilesGameProps: CrossTilesGameProps,
    reducerState: ReducerState,
    dispatch: React.Dispatch<ActionType>,
    isLegalWord: (word: string) => boolean,
) : CrossTilesContext {
    const G = crossTilesGameProps.G;

    return {
        ...G,
        ...reducerState,
        orderedPlayerIDs: makePlayerIDs(G, reducerState.playerID),
        wrappedGameProps: crossTilesGameProps, //kludge? Note that 'G' is not available to clients
        dispatch: dispatch,
        isLegalWord: isLegalWord,
        serverError: G.serverError,
    };
}