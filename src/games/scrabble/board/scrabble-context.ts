import React, { Dispatch } from "react";
import { sAssert } from "../../../utils/assert";
import { ReducerState } from "../local-actions/reducer-state";
import { ActionType } from "../local-actions/scrabble-reducer";
import { ScrabbleConfig } from "../config";
import { WrappedGameProps } from "../../../app-game-support";
import { MoveHistoryElement } from "../global-actions/move-hstory";
import { ClientMoves } from "../global-actions/bgio-moves";
import { isServerData } from "../global-actions";
import { ScrabbleGameProps } from "./game-props";

export interface ScrabbleContext extends ReducerState {
    readonly wrappedGameProps: WrappedGameProps<unknown, ClientMoves>; // Bgio properties other than game state
    playerID: string;
    currentPlayer: string;

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>;
    readonly isLegalWord: (word: string) => boolean;

    readonly historyLength: number;
    readonly moveHistory: MoveHistoryElement[];

    readonly serverError: string | null;
}

export const ReactScrabbleContext = React.createContext<ScrabbleContext|null>(null);

export function useScrabbleContext() : ScrabbleContext {
    const context = React.useContext(ReactScrabbleContext);
    sAssert(context);

    return context;
}

export function makeScrabbleContext(
    scrabbleGameProps: ScrabbleGameProps,
    config: ScrabbleConfig,
    reducerState: ReducerState,
    dispatch: React.Dispatch<ActionType>,
    isLegalWord: (word: string) => boolean,
) : ScrabbleContext {
    const G = scrabbleGameProps.G;
    sAssert(isServerData(G), "Game state appears to be invalid");

    const historyPosition = reducerState.reviewGameHistory ? 
        reducerState.reviewGameHistory.historyPosition : G.states.length - 1;
    const moveHistory = G.states[historyPosition].moveHistory;

    sAssert(scrabbleGameProps.playerID);

    return {
        ...reducerState,
        wrappedGameProps: scrabbleGameProps, //kludge? Note that 'G' is not available to clients

        playerID: scrabbleGameProps.playerID,
        currentPlayer: scrabbleGameProps.ctx.currentPlayer,

        config: config,
        dispatch: dispatch,

        historyLength: G.states.length,
        moveHistory: moveHistory,

        isLegalWord: isLegalWord,
    
        serverError: G.serverError,
    };
}