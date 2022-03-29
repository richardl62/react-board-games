import React, { useEffect, useReducer } from "react";
import { sAssert } from "../../utils/assert";
import { WrappedGameProps } from "../../app-game-support";
import { scrabbleReducer } from "./local-actions/scrabble-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";
import { ScrabbleGameProps } from "./board/game-props";
import { ReactScrabbleContext, ScrabbleContext } from "./board/scrabble-context";
import { isServerData } from "./global-actions";
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
    const G = scrabbleGameProps.G;
    sAssert(isServerData(G), "Game state appears to be invalid");

    const { config } = props;

    const [localState, dispatch] = useReducer(scrabbleReducer, 
        initialReducerState(scrabbleGameProps, config)
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
            data: scrabbleGameProps,
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
