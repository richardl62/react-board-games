import React, { useEffect, useReducer } from "react";
import { useAsync } from "react-async-hook";
import { AsyncStatus } from "../../../utils/async-status";
import { getWordChecker } from "../../../utils/get-word-checker";
import { Board } from ".";
import { ScrabbleGameProps } from "../client-side/srcabble-game-props";
import { initialReducerState } from "../client-side/reducer-state";
import { scrabbleReducer } from "../client-side/scrabble-reducer";
import { ScrabbleConfig } from "../config";
import { makeScrabbleContext, ReactScrabbleContext } from "../client-side/scrabble-context";
import { isScrabbleConfig } from "../config/scrabble-config";
import { sAssert } from "../../../utils/assert";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";

// import { beep } from "./sounds";

export interface BoardWrapperProps {
    customData: unknown,
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const config = props.customData as ScrabbleConfig;
    sAssert(isScrabbleConfig(config), "Invalid Srabble context");

    const scrabbleGameProps = useStandardBoardContext() as ScrabbleGameProps;

    const [reducerState, dispatch] = useReducer(scrabbleReducer, 
        initialReducerState(scrabbleGameProps, config)
    );

    const downHandler = (event: KeyboardEvent) => 
        dispatch({ type: "keydown", data: {key: event.key}});

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

    if (scrabbleGameProps.G.moveCount !== reducerState.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: scrabbleGameProps,
        });

        // if(localState.soundsAllowed) {
        //     beep();
        // }
    } 

    const context = makeScrabbleContext(scrabbleGameProps, config, reducerState, dispatch, isLegalWord);

    return <ReactScrabbleContext.Provider value={context}>
        <Board />
    </ReactScrabbleContext.Provider>;
}

export default BoardWrapper;
