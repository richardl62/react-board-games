import { nNonNull } from "../../../utils/n-non-null";
import { ScabbbleGameProps } from "../board/game-props";
import { ScrabbleConfig } from "../config";
import { GameState } from "../global-actions/game-state";
import { getLocalGameState, LocalGameState } from "./local-game-state";

export type ClickMoveDirection = "right" | "down";

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: ClickMoveDirection;
} 

export interface ReducerState extends LocalGameState {
    gameStates: GameState[];
    historyPosition: number;

    clickMoveStart: ClickMoveStart | null;
    externalTimestamp: number;

    showRewindControls: boolean;

    // KLUDGE? The members below are used only for sanity checks.
    scrabbleGameProps: ScabbbleGameProps;
    config: ScrabbleConfig;
}

export function initialReducerState(
    scrabbleGameProps: ScabbbleGameProps,
    config: ScrabbleConfig,
): ReducerState {
    // The code is an edited copy of the "externalStateChange" reducer action. 
    const { states, timestamp } = scrabbleGameProps.G;
    const historyPosition = states.length - 1;
    return {
        ...getLocalGameState(states[historyPosition], scrabbleGameProps.playerID),
        gameStates: states,
        historyPosition: states.length-1,
        externalTimestamp: timestamp,

        clickMoveStart: null,
        showRewindControls: false,
    
        scrabbleGameProps: scrabbleGameProps,
        config: config,
    };
}

/** Return a short-ish string describing problems found or null if no problem was found.
 */
export function sanityCheck(state: ReducerState): string | null {
    // Sanity check
    const nTiles = countTiles(state);
    const nTilesExpected = state.config.makeFullBag().length; // inefficient
    if(nTiles !== nTilesExpected) {
        return `Sanity check failure: expected ${nTilesExpected} tiles but found ${nTiles}`;
    }

    return null;
}

function countTiles(state: ReducerState): number {
    let racks = nNonNull(state.rack);
    for (const playerID in state.playerData) {
        if (playerID !== state.scrabbleGameProps.playerID) {
            racks += nNonNull(state.playerData[playerID].rack);
        }
    }

    const board = nNonNull(state.board.flat()); // inefficient.
    const bag = state.nTilesInBag;
    return racks + board + bag;
}
