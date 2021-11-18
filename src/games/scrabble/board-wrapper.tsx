import React, { useReducer } from "react";
import { sAssert } from "shared/assert";
import { BgioGameProps } from "shared/bgio-game-props";
import { GeneralGameState, isGlobalGameState } from "./actions";
import { getLocalGameState } from "./actions/local-game-state";
import { localGameStateReducer } from "./actions/local-game-state-reducer";
import { Board } from "./board";
import { ScrabbleConfig } from "./config";

export interface BoardWrapperProps {
    appBoardProps: BgioGameProps;
    config: ScrabbleConfig
}

export function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const bgioProps = props.appBoardProps as BgioGameProps<GeneralGameState>;
    sAssert(isGlobalGameState(bgioProps.G));

    const [state, dispatch] = useReducer(localGameStateReducer, bgioProps, getLocalGameState );

    if (bgioProps.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(bgioProps),
        });
    } 

    return <Board
        {...state}
        bgioProps={bgioProps}
        config={props.config}
        dispatch={dispatch}
    />;
}
