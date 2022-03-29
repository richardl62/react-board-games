import React, { useEffect, useReducer } from "react";
import { WrappedGameProps } from "../../app-game-support";
import { scrabbleReducer } from "./local-actions/scrabble-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";
import { ScrabbleGameProps } from "./board/game-props";
import { makeScrabbleContext, ReactScrabbleContext} from "./board/scrabble-context";
import { getWordChecker } from "../../utils/get-word-checker";
import { useAsync } from "react-async-hook";
import { AsyncStatus } from "../../utils/async-status";
import { initialReducerState } from "./local-actions/reducer-state";
// import { beep } from "./sounds";

export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const scrabbleGameProps = props.appBoardProps as unknown as ScrabbleGameProps;
    const { config } = props;

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

    if (scrabbleGameProps.G.timestamp !== reducerState.externalTimestamp) {
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
