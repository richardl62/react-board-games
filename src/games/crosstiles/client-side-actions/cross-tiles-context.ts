import React, { Dispatch } from "react";
import { WrappedGameProps } from "../../../app-game-support";
import { sAssert } from "../../../utils/assert";
import { ActionType, ReducerState } from "../client-side-actions/cross-tiles-reducer";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";
import { CrossTilesGameProps } from "./cross-tiles-game-props";


export interface CrossTilesContext extends ServerData, ReducerState{
    readonly wrappedGameProps: WrappedGameProps<unknown, ClientMoves>; // Bgio properties other than game state

    readonly dispatch:  Dispatch<ActionType>;
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
        ...crossTilesGameProps.G,
        ...reducerState,
        wrappedGameProps: crossTilesGameProps, //kludge? Note that 'G' is not available to clients
        dispatch: dispatch,
        isLegalWord: isLegalWord,
        serverError: G.serverError,
    };
}