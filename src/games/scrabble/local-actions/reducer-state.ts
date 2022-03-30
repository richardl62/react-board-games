import { nNonNull } from "../../../utils/n-non-null";
import { ScrabbleGameProps } from "../board/game-props";
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

    reviewGameHistory: {historyPosition: number} | false;

    clickMoveStart: ClickMoveStart | null;
    externalTimestamp: number


    // KLUDGE? The members below are used only for sanity checks.
    scrabbleGameProps: ScrabbleGameProps;
    config: ScrabbleConfig;
}

interface SimplifedReducerState {
    clickMoveStart: ReducerState["clickMoveStart"];
    config: ReducerState["config"];
    reviewGameHistory: ReducerState["reviewGameHistory"];
}

export function initialReducerState(
    scrabbleGameProps: ScrabbleGameProps,
    config: ScrabbleConfig,
): ReducerState {

    const simplifiedState : SimplifedReducerState = {
        clickMoveStart: null,
        reviewGameHistory: false,
        config: config,
    };

    return newReducerState(scrabbleGameProps, simplifiedState);
}

export function newReducerState(
    scrabbleGameProps: ScrabbleGameProps,
    simplifiedState: SimplifedReducerState,
): ReducerState {
    const { states, timestamp } = scrabbleGameProps.G;
    const historyPosition = simplifiedState.reviewGameHistory ? 
        simplifiedState.reviewGameHistory.historyPosition : states.length-1;

    return {
        ...simplifiedState,
        ...getLocalGameState(states[historyPosition], scrabbleGameProps.playerID),
        
        gameStates: states,

        externalTimestamp: timestamp,
        scrabbleGameProps: scrabbleGameProps,
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
