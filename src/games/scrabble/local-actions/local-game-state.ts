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
    board: BoardData;
    rack: Rack;

    clickMoveStart: ClickMoveStart | null;

    nTilesInBag: number;
    playerData: GameState["playerData"];
    externalTimestamp: number;

    // KLUDGE? This is (at time of writing) the members below only in sanity checks.
    scrabbleGameProps: ScabbbleGameProps;
    config: ScrabbleConfig;

    soundsAllowed: boolean;
}

export function getLocalGameState(scrabbleGameProps: ScabbbleGameProps, config: ScrabbleConfig,
    {soundsAllowed} : {soundsAllowed: boolean}): LocalGameState
{
    const {G, playerID } = scrabbleGameProps;
    const state = G.states[G.currentState];

    // KLUDGE? - Not sure when playerID can be null.
    sAssert(playerID && state.playerData[playerID], "Player ID appears to be invalid");

    const rack = state.playerData[playerID].rack;
    return {
        board: state.board,
        rack: rack,

        clickMoveStart: null,

        nTilesInBag: state.bag.length,
        
        /** KLUDGE?: Intended only to allow players scores to be seen. 
         * But also gives access to racks
        */
        playerData: state.playerData,
        
        /** Incremented when any of the state above is changed (and prehaps at
         * other times). */
        externalTimestamp: G.timestamp,

        /* KLUDGE?: See comment on type definition */
        scrabbleGameProps: scrabbleGameProps,
        config: config,

        soundsAllowed: soundsAllowed,
    };
}
