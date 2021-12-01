import React, { useReducer } from "react";
import { sAssert } from "../../shared/assert";
import { WrappedGameProps } from "../../bgio";
import { isGlobalGameState } from "./actions";
import { getLocalGameState } from "./actions/local-game-state";
import { localGameStateReducer } from "./actions/local-game-state-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";
import { ScabbbleGameProps } from "./board/game-props";

export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
    config: ScrabbleConfig
}

export function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const bgioProps = props.appBoardProps as unknown as ScabbbleGameProps;
    sAssert(isGlobalGameState(bgioProps.G), "Game state appears to be invalid");

    const [state, dispatch] = useReducer(localGameStateReducer, bgioProps, 
        props => getLocalGameState(props.G, props.playerID) 
    );

    if (bgioProps.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(bgioProps.G, bgioProps.playerID),
        });
    } 

    return <Board
        {...state}
        bgioProps={bgioProps}
        config={props.config}
        dispatch={dispatch}
    />;
}
