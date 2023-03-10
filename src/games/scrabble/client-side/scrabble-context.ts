import React, { Dispatch } from "react";
import { sAssert } from "../../../utils/assert";
import { ReducerState } from "./reducer-state";
import { ActionType } from "./scrabble-reducer";
import { ScrabbleConfig } from "../config";
import { ClientMoves } from "../server-side/moves";
import { isServerData, ServerData } from "../server-side";
import { ScrabbleGameProps } from "./srcabble-game-props";
import { GameState } from "../server-side/game-state";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { RequiredServerData } from "../../../app-game-support/required-state";

export interface ScrabbleContext extends ReducerState {
    readonly wrappedGameProps: WrappedGameProps<RequiredServerData, ClientMoves>; // Omit game-specific server data
    playerID: string;
    currentPlayer: string;

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>;
    readonly isLegalWord: (word: string) => boolean;

    readonly historyLength: number;
    readonly moveHistory: GameState["moveHistory"];

    readonly winnerIds: GameState["winnerIds"],

    readonly moveError: ServerData["moveError"];
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

    const finalGameState = G.states[G.states.length-1];
    let playerID;
    let currentPlayer;
    let moveHistory;
    if (reducerState.reviewGameHistory) {
        const gameState = G.states[reducerState.reviewGameHistory.historyPosition];
        currentPlayer = gameState.currentPlayer;
        playerID = currentPlayer;
        moveHistory = gameState.moveHistory;
    } else {
        playerID = scrabbleGameProps.playerID;
        currentPlayer = scrabbleGameProps.ctx.currentPlayer;
        moveHistory = finalGameState.moveHistory;
    }

    sAssert(scrabbleGameProps.playerID);

    return {
        ...reducerState,
        wrappedGameProps: scrabbleGameProps, //kludge? Note that 'G' is not available to clients

        playerID: playerID,
        currentPlayer: currentPlayer,

        config: config,
        dispatch: dispatch,

        historyLength: G.states.length,
        moveHistory: moveHistory,

        isLegalWord: isLegalWord,

        winnerIds: finalGameState.winnerIds,
    
        moveError: G.moveError,
    };
}