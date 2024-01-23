import { ScrabbleGameProps } from "./srcabble-game-props";
import { ScrabbleConfig } from "../config";
import { GameState } from "../server-side/game-state";
import { getLocalGameState, LocalGameState } from "./local-game-state";
import { WordPosition } from "../../../utils/word-finder/get-legal-words/word-position";
import { LegalWordAndScore } from "../high-scoring-words/get-high-scoring-words";

export interface ReducerState extends LocalGameState {
    gameStates: GameState[];

    // KLUDGE? The members below are used only for sanity checks.
    scrabbleGameProps: ScrabbleGameProps;
    config: ScrabbleConfig;

    externalTimestamp: number;

    focusInWordChecker: boolean;

    reviewGameHistory: { historyPosition: number } | false;
    
    highScoringWords: { 
        possibleWords: LegalWordAndScore[],
        position: number; 
    } | null;

    clickMoveStart: WordPosition | null;
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
    const { states, moveCount } = scrabbleGameProps.G;
    const historyPosition = simplifiedState.reviewGameHistory ? 
        simplifiedState.reviewGameHistory.historyPosition : states.length-1;

    let playerID;
    if(simplifiedState.reviewGameHistory) {
        // View the game from the perspective of the current player
        playerID = states[simplifiedState.reviewGameHistory.historyPosition].currentPlayer;
    } else {
        playerID = scrabbleGameProps.playerID;
    }

    let { reviewGameHistory } = simplifiedState;
    // Enable game history if the game is over.
    const gameOver = !!states.at(-1)?.winnerIds;
    if (gameOver && !reviewGameHistory) {
        reviewGameHistory = { historyPosition: states.length - 1 };
    }

    return {
        ...simplifiedState,
        ...getLocalGameState(states[historyPosition], playerID),
        focusInWordChecker: false,
        
        gameStates: states,

        highScoringWords: null,
        reviewGameHistory,

        externalTimestamp: moveCount,
        scrabbleGameProps: scrabbleGameProps,
    };
}

