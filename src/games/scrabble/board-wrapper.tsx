import React, { useEffect, useReducer } from "react";
import { sAssert } from "../../utils/assert";
import { WrappedGameProps } from "../../app-game-support";
import { getLocalGameState } from "./local-actions/local-game-state";
import { localGameStateReducer } from "./local-actions/local-game-state-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";
import { ScabbbleGameProps } from "./board/game-props";
import { ReactScrabbleContext, ScrabbleContext } from "./board/scrabble-context";
import { isServerData } from "./global-actions";
import { getWordChecker } from "../../utils/get-word-checker";
import { useAsync } from "react-async-hook";
import { AsyncStatus } from "../../utils/async-status";
// import { beep } from "./sounds";

export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const scrabbleGameProps = props.appBoardProps as unknown as ScabbbleGameProps;
    const G = scrabbleGameProps.G;
    sAssert(isServerData(G), "Game state appears to be invalid");

    const [localState, dispatch] = useReducer(localGameStateReducer, scrabbleGameProps, 
        scrabbleGameProps => getLocalGameState(scrabbleGameProps, props.config, 
            {showRewindControls: false, historyPosition: 0})
    );

    const downHandler = (event: KeyboardEvent) => dispatch({ type: "keydown", data: {key: event.key}});

    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    const asyncWordChecker = useAsync(getWordChecker, []);

    const isLegalWord = asyncWordChecker.result;
    if(!isLegalWord) {
        return <AsyncStatus status={asyncWordChecker} activity="loading dictionary" />;
    }

    if (G.timestamp !== localState.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(scrabbleGameProps, props.config, 
                {...localState, historyPosition: G.states.length-1}),
        });

        // if(localState.soundsAllowed) {
        //     beep();
        // }
    } 

    const gameState = G.states[localState.historyPosition];

    const gameProps: ScrabbleContext = {
        ...localState,
        bgioProps: scrabbleGameProps, //kludge? Note that 'G' is not available to clients

        config: props.config,
        dispatch: dispatch,
        isLegalWord: isLegalWord,

        historyLength: G.states.length,
        moveHistory: gameState.moveHistory,
    
        serverError: G.serverError,
    };

    return <ReactScrabbleContext.Provider value={gameProps }>
        <Board />
    </ReactScrabbleContext.Provider>;
}

export default BoardWrapper;
