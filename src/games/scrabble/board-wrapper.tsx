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
import { beep } from "./sounds";

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

    if (G.timestamp !== localState.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(scrabbleGameProps, props.config,
                {soundsAllowed: localState.soundsAllowed}),
        });

        if(localState.soundsAllowed) {
            beep();
        }
    } 

    const gameState = G.states[G.currentState];

    const gameProps: ScrabbleContext = {
        ...localState,
        bgioProps: scrabbleGameProps, //kludge? Note that 'G' is not available to clients
        moveHistory: gameState.moveHistory,
        serverError: G.serverError,
        config: props.config,
        dispatch: dispatch,
        isLegalWord: isLegalWord,
    };

    return <ReactScrabbleContext.Provider value={gameProps }>
        <Board />
    </ReactScrabbleContext.Provider>;
}

export default BoardWrapper;
