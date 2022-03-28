import { sAssert } from "../../../utils/assert";
import { ScabbbleGameProps } from "../board/game-props";
import { ScrabbleConfig } from "../config";
import { Rack } from "./board-and-rack";
import { BoardData, GameState } from "../global-actions/game-state";

export type ClickMoveDirection = "right" | "down";

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: ClickMoveDirection;
} 

export interface LocalGameState {
    gameStates: GameState[];
    historyPosition: number;

    board: BoardData;
    rack: Rack;
    playerData: GameState["playerData"];
    nTilesInBag: number;

    clickMoveStart: ClickMoveStart | null;
    externalTimestamp: number;

    showRewindControls: boolean;

    // KLUDGE? The members below are used only for sanity checks.
    scrabbleGameProps: ScabbbleGameProps;
    config: ScrabbleConfig;
}

export function getLocalGameState(scrabbleGameProps: ScabbbleGameProps, config: ScrabbleConfig,
    {showRewindControls, historyPosition } : {showRewindControls: boolean, historyPosition: number}): LocalGameState
{
    const {G, playerID } = scrabbleGameProps;
    const state = G.states[historyPosition];

    // KLUDGE? - Not sure when playerID can be null.
    sAssert(playerID && state.playerData[playerID], "Player ID appears to be invalid");

    const rack = state.playerData[playerID].rack;
    return {
        gameStates: G.states,
        historyPosition: historyPosition,

        board: state.board,
        rack: rack,
        nTilesInBag: state.bag.length,
        playerData: state.playerData,

        clickMoveStart: null,

        /** Incremented when any of the state above is changed (and prehaps at
         * other times). */
        externalTimestamp: G.timestamp,

        showRewindControls: showRewindControls,

        // KLUDGE? The members below are used only for sanity checks.
        scrabbleGameProps: scrabbleGameProps,
        config: config,
    };
}
