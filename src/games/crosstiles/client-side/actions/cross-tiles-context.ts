import React, { Dispatch } from "react";
import { sAssert } from "../../../../utils/assert";
import { ActionType, ReducerState } from "./cross-tiles-reducer";
import { ClientMoves } from "../../server-side/moves";
import { ServerData } from "../../server-side/server-data";
import { CrossTilesGameProps } from "./cross-tiles-game-props";
import { WrappedGameProps } from "../../../../app-game-support/wrapped-game-props";



export interface CrossTilesContext extends ServerData, ReducerState{
    readonly wrappedGameProps: WrappedGameProps<unknown, ClientMoves>; // Bgio properties other than game state

    readonly dispatch:  Dispatch<ActionType>;

    readonly nPlayers: number,
    
    // Get the ID of the nth player, with players ordered to start with the
    // actionve player (i.e. playerID).  This is provided as a function rather
    // than array to avoid subtle bugs that might arise if for...in is used in
    // place of for...of. 
    readonly nthPlayerID: (n: number) => string;
    
    readonly isLegalWord: (word: string) => boolean;
}

export const ReactCrossTilesContext = React.createContext<CrossTilesContext|null>(null);

export function useCrossTilesContext() : CrossTilesContext {
    const context = React.useContext(ReactCrossTilesContext);
    sAssert(context);

    return context;
}

// Return an array of player IDs starting with 'first'.
function orderedPlayerIDs(G: ServerData, first: string) {
    const pids: string[] = [];
    for(const pid in G.playerData) {
        pids.push(pid);
    }

    sAssert(pids.includes(first));

    while(pids[0] !== first) {
        pids.push(pids.shift()!);
    }

    return pids;
}

export function makeCrossTilesContext(
    crossTilesGameProps: CrossTilesGameProps,
    reducerState: ReducerState,
    dispatch: React.Dispatch<ActionType>,
    isLegalWord: (word: string) => boolean,
) : CrossTilesContext {
    const G = crossTilesGameProps.G;

    const pids = orderedPlayerIDs(G, reducerState.playerID);

    return {
        ...G,
        ...reducerState,
        nPlayers: pids.length,
        nthPlayerID: (n: number) => pids[n], // See comment on CrossTilesContext
        wrappedGameProps: crossTilesGameProps, //kludge? Note that 'G' is not available to clients
        dispatch: dispatch,
        isLegalWord: isLegalWord,
        serverError: G.serverError,
    };
}