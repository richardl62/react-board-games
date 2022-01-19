import React, { useEffect, useReducer } from "react";
import { sAssert } from "../../shared/assert";
import { WrappedGameProps } from "../../bgio";
import { getLocalGameState } from "./local-actions/local-game-state";
import { localGameStateReducer } from "./local-actions/local-game-state-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";
import { ScabbbleGameProps } from "./board/game-props";
import { ReactScrabbleContext, ScrabbleContext } from "./board/scrabble-context";
import { isGlobalGameState } from "./global-actions";
import { getWordChecker } from "./get-word-checker";
import { useAsync } from "react-async-hook";
import { AsyncStatus } from "../../shared/async-status";
import { beep } from "./sounds";

export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const scrabbleGameProps = props.appBoardProps as unknown as ScabbbleGameProps;
    sAssert(isGlobalGameState(scrabbleGameProps.G), "Game state appears to be invalid");

    const [state, dispatch] = useReducer(localGameStateReducer, scrabbleGameProps, 
        scrabbleGameProps => getLocalGameState(scrabbleGameProps, props.config, 
            {soundsAllowed: false})
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

    if (scrabbleGameProps.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(scrabbleGameProps, props.config,
                {soundsAllowed: state.soundsAllowed}),
        });

        if(state.soundsAllowed) {
            beep();
        }
    } 

    const gameProps: ScrabbleContext = {
        ...state,
        bgioProps: scrabbleGameProps,
        config: props.config,
        dispatch: dispatch,
        isLegalWord: isLegalWord,
    };

    return <ReactScrabbleContext.Provider value={gameProps }>
        <Board />
    </ReactScrabbleContext.Provider>;
}

export default BoardWrapper;
