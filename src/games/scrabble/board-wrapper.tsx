import React, { useReducer } from "react";
import { sAssert } from "../../shared/assert";
import { WrappedGameProps } from "../../bgio";
import { getLocalGameState } from "./local-actions/local-game-state";
import { localGameStateReducer } from "./local-actions/local-game-state-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";
import { ScabbbleGameProps } from "./board/game-props";
import { ReactScrabbleContext, ScrabbleContext } from "./board/scrabble-context";
import { isGlobalGameState } from "./global-actions";

export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
    config: ScrabbleConfig
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const scrabbleGameProps = props.appBoardProps as unknown as ScabbbleGameProps;
    sAssert(isGlobalGameState(scrabbleGameProps.G), "Game state appears to be invalid");

    const [state, dispatch] = useReducer(localGameStateReducer, scrabbleGameProps, 
        scrabbleGameProps => getLocalGameState(scrabbleGameProps, props.config)
    );

    if (scrabbleGameProps.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(scrabbleGameProps, props.config),
        });
    } 

    const gameProps: ScrabbleContext = {
        ...state,
        bgioProps: scrabbleGameProps,
        config: props.config,
        dispatch: dispatch,
    };

    return <ReactScrabbleContext.Provider value={gameProps }>
        <Board />
    </ReactScrabbleContext.Provider>;
}

export default BoardWrapper;
