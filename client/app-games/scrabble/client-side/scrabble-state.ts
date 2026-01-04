import { Dispatch } from "react";
import { sAssert } from "@utils/assert";
import { ReducerState } from "./reducer-state";
import { ActionType } from "./scrabble-reducer";
import { ScrabbleConfig } from "@game-control/games/scrabble/config/scrabble-config";
import { ClientMoves } from "@game-control/games/scrabble/moves/moves";
import { isServerData, ServerData } from "@game-control/games/scrabble/server-data";
import { ScrabbleGameProps } from "./srcabble-game-props";
import { GameState } from "@game-control/games/scrabble/moves/game-state";
import { WrappedMatchProps } from "../../../app-game-support/wrapped-match-props";
import { Trie } from "@utils/word-finder/trie";

import React from "react";
import { SetupOptions } from "@game-control/games/scrabble/server-data";

export interface ScrabbleState extends ReducerState {
    readonly wrappedGameProps: WrappedMatchProps<ServerData, ClientMoves>; // Omit game-specific server data
    playerID: string;
    currentPlayer: string;

    readonly options: SetupOptions,
    readonly config: ScrabbleConfig;

    readonly dispatch:  Dispatch<ActionType>;
    readonly legalWords: Trie;

    readonly historyLength: number;
    readonly moveHistory: GameState["moveHistory"];

    readonly winnerIds: GameState["winnerIds"],
}

export const ReactScrabbleContext = React.createContext<ScrabbleState|null>(null);

export function useScrabbleState() : ScrabbleState {
    const context = React.useContext(ReactScrabbleContext);
    sAssert(context);

    return context;
}

export function makeScrabbleState(
    scrabbleGameProps: ScrabbleGameProps,
    config: ScrabbleConfig,
    reducerState: ReducerState,
    dispatch: React.Dispatch<ActionType>,
    legalWords: Trie,
) : ScrabbleState {
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

        playerID,
        currentPlayer,

        options: G.options,
        config,
        dispatch,

        historyLength: G.states.length,
        moveHistory,

        legalWords,

        winnerIds: finalGameState.winnerIds,
    };
}