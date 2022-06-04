import { ScrabbleGameProps } from "./srcabble-game-props";
import { ScrabbleConfig } from "../config";
import { GameState } from "../server-side/game-state";
import { getLocalGameState, LocalGameState } from "./local-game-state";
import { ClickMoveDirection } from "../../../utils/board/click-move-marker";

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: ClickMoveDirection;
} 

export interface ReducerState extends LocalGameState {
    gameStates: GameState[];

    // KLUDGE? The members below are used only for sanity checks.
    scrabbleGameProps: ScrabbleGameProps;
    config: ScrabbleConfig;

    externalTimestamp: number;

    focusInWordChecker: boolean;

    reviewGameHistory: { historyPosition: number } | false;

    clickMoveStart: ClickMoveStart | null;
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

    let playerID;
    if(simplifiedState.reviewGameHistory) {
        // View the game from the perspective of he current player
        playerID = states[simplifiedState.reviewGameHistory.historyPosition].currentPlayer;
    } else {
        playerID = scrabbleGameProps.playerID;
    }

    return {
        ...simplifiedState,
        ...getLocalGameState(states[historyPosition], playerID),
        focusInWordChecker: false,
        
        gameStates: states,

        externalTimestamp: timestamp,
        scrabbleGameProps: scrabbleGameProps,
    };
}

