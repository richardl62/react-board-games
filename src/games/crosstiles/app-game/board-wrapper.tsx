import React, { useReducer } from "react";
import { useAsync } from "react-async-hook";
import { WrappedGameProps } from "../../../app-game-support";
import { AsyncStatus } from "../../../utils/async-status";
import { getWordChecker } from "../../../utils/get-word-checker";
import { Board } from "../board";
import { makeCrossTilesContext, ReactCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { crossTilesReducer, initialReducerState } from "../client-side/actions/cross-tiles-reducer";


export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const crossTilesGameProps = props.appBoardProps as unknown as CrossTilesGameProps;

    const [reducerState, dispatch] = useReducer(crossTilesReducer, initialReducerState);

    if(reducerState.serverData?.timestamp !== crossTilesGameProps.G.timestamp) {
        dispatch({type: "reflectServerData", data: crossTilesGameProps.G});
    }
    
    const asyncWordChecker = useAsync(getWordChecker, []);
    const isLegalWord = asyncWordChecker.result;
    if(!isLegalWord) {
        return <AsyncStatus status={asyncWordChecker} activity="loading dictionary" />;
    }

    const context = makeCrossTilesContext(crossTilesGameProps, reducerState, dispatch, isLegalWord);

    return <ReactCrossTilesContext.Provider value={context}>
        <Board />
    </ReactCrossTilesContext.Provider>;
}

export default BoardWrapper;

