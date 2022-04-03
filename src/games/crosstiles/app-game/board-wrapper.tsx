import React, { useReducer } from "react";
// import { useAsync } from "react-async-hook";
import { WrappedGameProps } from "../../../app-game-support";
import { sAssert } from "../../../utils/assert";
// import { AsyncStatus } from "../../../utils/async-status";
// import { getWordChecker } from "../../../utils/get-word-checker";
import { Board } from "../board";
import { makeCrossTilesContext, ReactCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { CrossTilesGameProps } from "../client-side-actions/cross-tiles-game-props";
import { crossTilesReducer, initialReducerState } from "../client-side-actions/cross-tiles-reducer";
import { isServerData } from "../server-side/server-data";

export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const crossTileGameProps = props.appBoardProps as unknown as CrossTilesGameProps;
    sAssert(isServerData(crossTileGameProps.G), "Server data appears invalid");

    const [reducerState, dispatch] = useReducer(crossTilesReducer, initialReducerState);
    // const asyncWordChecker = useAsync(getWordChecker, []);

    // const isLegalWord = asyncWordChecker.result;
    // if(!isLegalWord) {
    //     return <AsyncStatus status={asyncWordChecker} activity="loading dictionary" />;
    // }

    const isLegalWord = () => {
        throw new Error("isLegalWord not implemented");
    };

    if (crossTileGameProps.G.timestamp !== reducerState.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: crossTileGameProps,
        });
    } 

    const context = makeCrossTilesContext(crossTileGameProps, reducerState, dispatch, isLegalWord);

    return <ReactCrossTilesContext.Provider value={context}>
        <Board />
    </ReactCrossTilesContext.Provider>;
}

export default BoardWrapper;

